import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import CreatePostForm from "../CreatePostForm/CreatePostForm";

import css from "./App.module.css";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService";
import { Post } from "../../services/postService";
import EditPostForm from "../EditPostForm/EditPostForm";

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreatedPost, setIsCreatedPost] = useState<boolean>(false);
  const [isEditPost, setIsEditPost] = useState<boolean>(false);
  const [editedPost, setIsEditedPost] = useState<Post | null>(null);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const { data } = useQuery({
    queryKey: ["posts", debouncedSearchQuery, currentPage],
    queryFn: () => fetchPosts(debouncedSearchQuery, currentPage),
    placeholderData: keepPreviousData,
  });

  const changeSearchQuery = (newQuery: string) => {
    setCurrentPage(1);
    setSearchQuery(newQuery);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleCreatePost = () => {
    setIsCreatedPost(!isCreatedPost);
  };

  const toggleEditPost = (postToEdit?: Post) => {
    if (postToEdit) {
      setIsEditedPost(postToEdit);
    }
    setIsEditPost(!isEditPost);
  };

  const posts = data?.posts ?? [];
  const totalPages = data?.totalCount ? Math.ceil(data.totalCount / 8) : 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onSearch={changeSearchQuery} />
        {totalPages > 1 && (
          <Pagination
            onPageChange={setCurrentPage}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        )}
        <button
          className={css.button}
          onClick={() => {
            toggleModal();
            toggleCreatePost();
          }}
        >
          Create post
        </button>
      </header>
      {isModalOpen && (
        <Modal
          onClose={() => {
            toggleModal();
            toggleCreatePost();
          }}
        >
          {isCreatedPost && (
            <CreatePostForm
              onClose={() => {
                toggleModal();
                toggleCreatePost();
              }}
            />
          )}
          {isEditPost && editedPost && (
            <EditPostForm
              initialValues={editedPost}
              onClose={() => {
                toggleModal();
                toggleEditPost();
                setIsEditedPost(null);
              }}
            />
          )}
        </Modal>
      )}
      {posts.length > 0 && (
        <PostList posts={posts} toggleModal={toggleModal} toggleEditPost={toggleEditPost} />
      )}
    </div>
  );
}
