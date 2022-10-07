import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
});

function Loading() {
  NProgress.start();

  useEffect(() => {
    NProgress.done();
  }, []);

  return <></>;
}

export default Loading;
