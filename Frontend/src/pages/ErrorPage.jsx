import "./ErrorPage.css";
import "animate.css";
import { useNavigate } from "react-router-dom"; // 1. Importar el hook

function ErrorPage() {
  const navigate = useNavigate(); // 2. Inicializarlo

  return (
    <div className="ErrorPage-Container">
      <h2>
        Oooooooops! <br />
        Something Went Wrong
      </h2>
      <span>Please try again later.</span>
      <img
        id="Warning"
        className="animate__animated animate__tada animate__infinite"
        src="/icons/warning.png"
        alt="Warning"
      />

      {/* 3. Botón de redirección */}
      <button className="error-button" onClick={() => navigate("/home")}>
        Go back Home
      </button>
    </div>
  );
}

export default ErrorPage;
