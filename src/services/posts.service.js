import { Post } from '../models/posts.models.js';
import { AppError } from '../utils/errors/AppError.js';

const createPost = async (postData) => {
  try {
    const { title, content, imageUrl, authorId } = postData;
    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      authorId: authorId,
    });
    return await post.save();
  } catch (error) {
    console.error('PostService :: creatPost :: error :: ', error);
    throw error;
  }
};

const getPostsByRole = async (user) => {
  try {
    if (user.role === 'ADMIN') {
      return await Post.find();
    }
    return await Post.find({ authorId: user._id });
  } catch (error) {
    console.error('PostService :: getPosts :: error :: ', error);
    throw error;
  }
};

const getPostByIdWithThrowError = async (postId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }
    return post;
  } catch (error) {
    console.error('PostService :: getPostById :: error :: ', error);
    throw error;
  }
};

const updatePostById = async (postId, post) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, post, { new: true });
    if (!updatedPost) {
      throw new AppError('Post not found', 404);
    }
    return updatedPost;
  } catch (error) {
    console.error('PostService :: updatePostById :: error :: ', error);
    throw error;
  }
};

const deletePostById = async (postId) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      throw new AppError('Post not found ', 404);
    }
  } catch (error) {
    console.error('PostService :: deletePostById :: error :: ', error);
    throw error;
  }
};

const deletePosts = async () => {
  try {
    return await Post.deleteMany();
  } catch (error) {
    console.error('PostService :: deletePosts :: error :: ', error);
    throw error;
  }
};

export default {
  createPost,
  getPostsByRole,
  getPostByIdWithThrowError,
  updatePostById,
  deletePostById,
  deletePosts,
};
