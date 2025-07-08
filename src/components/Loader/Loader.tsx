import CircleLoader from "react-spinners/CircleLoader";
import style from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={style.backdrop}>
      <CircleLoader color="#36bed6" size={60} />
    </div>
  );
}
