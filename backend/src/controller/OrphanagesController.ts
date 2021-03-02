import {Request, Response} from 'express';
import { getRepository } from 'typeorm';
import orphanageView from '../views/orphanages_views';
import * as yup from 'yup';

import Orphanage from '../models/Orphanage';

export default {
    async index(request: Request, response: Response) {
        const orphanagesRepository = getRepository(Orphanage);

        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });

        return response.json(orphanageView.renderMany(orphanages));   
    },

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const orphanagesRepository = getRepository(Orphanage);

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        });

        return response.json(orphanageView.render(orphanage));   
    },

    async create(request: Request, response: Response) {
       
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
        } = request.body;
    
        const orphanageRepository = getRepository(Orphanage);

        const requestImages = request.files as Express.Multer.File[];
        const images = requestImages.map(image => {
            return { path: image.filename }
        });

        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true',
            images
        };

        const schema = yup.object().shape({
            name: yup.string().required('Este campo é obrigatório'),
            latitude: yup.number().required('Este campo é obrigatório'),
            longitude: yup.number().required('Este campo é obrigatório'),
            about: yup.string().required('Este campo é obrigatório').max(300),
            instructions: yup.string().required('Este campo é obrigatório'),
            opening_hours: yup.string().required('Este campo é obrigatório'),
            open_on_weekends: yup.boolean().required('Este campo é obrigatório'),
            images: yup.array(yup.object().shape({
                path: yup.string().required(),
                })
            )

        });

        await schema.validate(data, {
            abortEarly: false,
        });
    
        const orphanage = orphanageRepository.create(data);
    
        await orphanageRepository.save(orphanage);
        
        return response.status(201).json(orphanage);
    }
}