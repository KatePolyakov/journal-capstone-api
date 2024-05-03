import { body } from 'express-validator';

export const loginValidation = [body('email').isEmail(), body('password').isLength({ min: 5 })];

export const registerValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  body('fullName').isLength({ min: 3 }),
  body('avatar').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Insert Title').isLength({ min: 3 }).isString(),
  body('text', 'Insert Text').isLength({ min: 10 }).isString(),
  body('tags', 'Insert Tag').optional().isString(),
  body('imageUrl', 'Link does not work').optional().isString(),
];
