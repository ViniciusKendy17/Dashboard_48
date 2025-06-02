import "../index.css";
import smart from "../assets/smart_ico.ico";
import Theme from "../services/SetTheme.jsx";
import useLocalStorage from "use-local-storage";
import world from "../assets/WS_Logo_DarkBlue_RGB.png";

export default function Header() {
  const [state, Setstate] = useLocalStorage("isDark", false);

  return (
    <>
      <header data-theme={state ? "dark" : ""}>
        <div className="out-img" id="wls">
          <img src={world} alt="" />
        </div>
        <div className="out-img" id="indus">
          <img src={smart} alt="" />
          <h2>Indústria 4.0</h2>
        </div>
      </header>
      <Theme state={state} toggle={() => Setstate(!state)} />
    </>
  );
}
