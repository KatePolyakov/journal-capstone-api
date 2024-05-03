import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from './validations/validations.js';
import checkAuth from './utils/checkAuth.js';

import { PostController, UserController } from './controllers/index.js';
import handleValidationErrors from './validations/handleValidationErrors.js';

//MongoDB+Mongoose
mongoose
  .connect('mongodb+srv://admin:123@blog-mern.34ltnbv.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB OK!'))
  .catch((err) => console.log('DB Error', err));

//Express
const app = express();
app.use(express.json());
app.use(cors()); //for cross localhosts
app.use('/uploads', express.static('uploads'));

//Multer
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//auth
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

//post images
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

//Posts CRUD
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);
app.delete('/posts/:id', checkAuth, PostController.remove);

//Posts get All posts
app.get('/posts', PostController.getAll);

//Posts get One post
app.get('/posts/:id', PostController.getOne);

//Get Tags
app.get('/posts/tags', PostController.getLastTags);
app.get('/tags', PostController.getLastTags);

//SERVER
app.listen(8080, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
