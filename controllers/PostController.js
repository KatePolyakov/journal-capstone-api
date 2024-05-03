import PostModel from '../models/post.js';

//Get all posts
export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot get All posts',
    });
  }
};

//get One post
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
    )
      .populate('user')
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: 'Cannot get THIS post',
          });
        }

        res.json(doc);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Cannot get THIS post',
          });
        }
      });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Cannot get THIS post',
    });
  }
};

//CRUD post
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Not found',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete({ _id: postId })
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: 'Cannot find this post',
          });
        }

        res.json({
          success: true,
        });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Cannot delete this post',
          });
        }
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot get this post',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(','),
        user: req.userId,
      },
    )
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: 'Cannot find this post',
          });
        }

        res.json({
          success: true,
        });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Cannot update this post',
          });
        }
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot get this post',
    });
  }
};

//Get Last Tags

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot get All tags',
    });
  }
};
