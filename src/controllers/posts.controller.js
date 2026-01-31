import postService from '../services/posts.service.js';

export const createPost = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const postData = { ...req.body, authorId: userId };

    const post = await postService.createPost(postData);

    res.status(201).json({
      success: true,
      message: `Post created `,
      post,
    });
  } catch (error) {
    console.error('PostController :: creatPost :: error :: ', error);
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const { user } = req;
    const posts = await postService.getPostsByRole(user);

    res.status(200).json({
      success: true,
      message: `Post Fetch successfully`,
      posts,
    });
  } catch (error) {
    console.error('PostController :: getPosts :: error :: ', error);
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await postService.getPostByIdWithThrowError(postId);

    res.status(200).json({
      success: true,
      message: `Post Fetch `,
      post,
    });
  } catch (error) {
    console.error('PostController :: getPostById :: error :: ', error);
    next(error);
  }
};

export const updatePostById = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const postData = req.body;

    const post = await postService.updatePostById(postId, postData);

    res.status(200).json({
      success: true,
      message: `Post Updated `,
      post,
    });
  } catch (error) {
    console.error('PostController :: updatePostById :: error :: ', error);
    next(error);
  }
};

export const deletePostById = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await postService.deletePostById(postId);

    res.status(200).json({
      success: true,
      message: `Post Deleted `,
      post,
    });
  } catch (error) {
    console.error('PostController :: deletePostById :: error :: ', error);
    next(error);
  }
};

export const deletePosts = async (req, res, next) => {
  try {
    const { postId } = req.params;

    await postService.deletePosts(postId);

    res.status(200).json({
      success: true,
      message: `All Post Deleted `,
    });
  } catch (error) {
    console.error('PostController :: deletePosts :: error :: ', error);
    next(error);
  }
};
