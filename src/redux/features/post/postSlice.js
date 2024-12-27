import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

const initialState = {
  posts: [],
  popularPosts: [],
  isLoading: false,
  status: null,
};

export const createPost = createAsyncThunk(
  "post/createPost",
  async (params) => {
    try {
      const { data } = await axios.post("/posts", params);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllPosts = createAsyncThunk("post/getAllPosts", async () => {
  try {
    const { data } = await axios.get("/posts");
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const removePost = createAsyncThunk("post/removePost", async (id) => {
  try {
    const { data } = await axios.delete(`/posts/${id}`, id);
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async (updatedPost) => {
    try {
      const { data } = await axios.put(`/posts/${updatedPost.id}`, updatedPost);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.status = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
      });
    builder
      // get all posts
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.popularPosts = action.payload.popularPosts;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
      });
    builder
      // delete post
      .addCase(removePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload._id
        );
      })
      .addCase(removePost.rejected, (state, action) => {
        state.isLoading = false;
      });
    builder
      // update post
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        state.posts[index] = action.payload;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});
export default postSlice.reducer;
