import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";

import { useEffect } from "react";

export default function Toast({ state, message, toggle, type }) {
  useEffect(() => {
    const tot = document.getElementById("tot");

    if (tot) {
      const toast = new bootstrap.Toast(tot);
      toast.show();

    //   setTimeout(() => {
    //     toast.hide()
    //     window.location.reload()
    //   }, 2500);
    }
  }, [state]);

  return(

    <>
      <div id="tot" state={state} style={{width:"230px"}} className={`toast text-bg-${type}`}  >
          <div className="d-flex" >  
            <div className="toast-body">{message}</div>

          <button className="btn-close btn-close-white me-3 m-auto" onClick={toggle} data-bs-dismiss="toast" ></button>

          </div>
      </div>

    </>

  );
}
