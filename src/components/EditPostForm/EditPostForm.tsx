import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import css from "./EditPostForm.module.css";
import { Post } from "../../services/postService";
import { editPost } from "../../services/postService";

const postSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(30, "Title must be at most 30 characters")
    .required("Title is required"),
  body: Yup.string()
    .max(500, "Content must be at most 500 characters")
    .required("Content is required"),
});

interface EditedPostProps {
  initialValues: Post;
  onClose: () => void;
}

export default function EditPostForm({ initialValues, onClose }: EditedPostProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Post updated");
      onClose();
    },
  });

  const handleSubmit = (values: Post, actions: FormikHelpers<Post>) => {
    mutation.mutate(values);
    actions.resetForm();
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={postSchema}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows={8} className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
            Edit post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
