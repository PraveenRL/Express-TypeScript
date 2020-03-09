import { Request, Response, NextFunction, Router } from 'express';
import PostModel from '../../controller/post/post.model';
import IController from '../../interfaces/controller.interface';
import UserModel from '../../controller/user/user.model';
import authMiddleWare from '../../middleware/auth.middleware';

class AggregationController implements IController {
    public path: string = "/user/aggregation";
    public router = Router();

    constructor() {
        this.initializeRoutes();
        this.router.use(this.path, authMiddleWare);
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/match`, this.$match);
        this.router.get(`${this.path}/group`, this.$group);
        this.router.get(`${this.path}/groupmatch`, this.$group$match);
        this.router.get(`${this.path}/lookup`, this.$lookup);
        this.router.get(`${this.path}/sort`, this.$sort);
        this.router.get(`${this.path}/addField`, this.$addField);
        this.router.get(`${this.path}/countDocuments`, this.countDocuments);
        this.router.get(`${this.path}/distinct`, this.distinct);

        this.router.get(`${this.path}/groupWithAuthentication`, authMiddleWare, this.$group);
    }

    //-- $match --//
    private $match = async (request: Request, response: Response) => {
        const arrayOfPosts = await PostModel.aggregate(
            [
                {
                    $match: {
                        content: 'mail@gmail.com'
                    }
                }
            ]
        );
        response.send(arrayOfPosts)
    }

    //-- $group --//
    private $group = async (request: Request, response: Response, next: NextFunction) => {
        const userByCity = await UserModel.aggregate(
            [
                {
                    $group: {
                        _id: {
                            city: '$address.city'
                        }
                    }
                }
            ]
        );
        response.send({
            userByCity
        })
    }

    //-- $group, $match, $exists, $push, count --//
    /** '$exists' - before grouping users, we first make sure to filter out all users 
    without the needed data. To do this, we use an operator called $exists. **/
    private $group$match = async (request: Request, response: Response) => {
        const userByCity = await UserModel.aggregate(
            [
                {
                    $match: {
                        'address.city': {
                            $exists: true
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            city: '$address.city'
                        },
                        usersId: {
                            $push: {
                                name: '$name',
                                _id: '$_id'
                            }
                        },
                        count: { $sum: 1 }
                    }
                }
            ]
        );
        response.send(userByCity);
    }

    //-- $lookup --//
    private $lookup = async (request: Request, response: Response) => {
        const lookupArray = await UserModel.aggregate(
            [
                {
                    $match: {
                        'address.city': {
                            $exists: true
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            city: '$address.city'
                        },
                        usersId: {
                            $push: {
                                name: '$name',
                                _id: '$_id'
                            }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "post",
                        localField: "usersId._id",
                        foreignField: "authorId",
                        as: "articles"
                    }
                }

            ]
        );
        response.send(lookupArray);
    }

    private $sort = async (request: Request, response: Response) => {
        const sortArray = await UserModel.aggregate(
            [
                {
                    $group: {
                        _id: {
                            city: '$address.city'
                        },
                        usersId: {
                            $push: {
                                name: '$name',
                                _id: '$_id'
                            }
                        },
                        count: { $sum: 1 }
                    }
                }, {
                    $sort: {
                        count: 1
                        // count: -1 -> reverse
                    }
                }
            ]
        );
        response.send(sortArray);
    }

    private $addField = async (request: Request, response: Response) => {
        const resultArray = await UserModel.aggregate(
            [
                {
                    $match: {
                        'address.city': {
                            $exists: true
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            city: '$address.city'
                        },
                        usersId: {
                            $push: {
                                name: '$name',
                                _id: '$_id'
                            }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "post",
                        localField: "usersId._id",
                        foreignField: "authorId",
                        as: "articles"
                    }
                },
                {
                    $addFields: {
                        amountOfArticles: {
                            $size: '$articles'
                        }
                    }
                },
                {
                    $sort: {
                        amountOfArticles: 1
                    }
                }

            ]
        );
        response.send(resultArray);
    }

    private countDocuments = async (request: Request, response: Response) => {
        const id = { name: "Praveen" }
        const count = await UserModel.countDocuments(id);
        response.send({ count });
        // const count$exists = await UserModel.countDocuments({ address: { $exists: true } }); /* Filter */
        // response.send({ count$exists });
    }

    private distinct = async (request: Request, response: Response) => {
        const cities = await UserModel.distinct(
            'address.city', {
            email: {
                $regex: /@gmail.com$/
            }
        });
        response.send(cities);
    }



}

export default AggregationController;