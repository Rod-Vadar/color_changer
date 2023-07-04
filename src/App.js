import { Container } from "react-bootstrap";

import Header from "./components/Header";
import Footer from "./components/Footer";

import ImageUploader from "./screens/FileRead";

function App() {
  return (
    <div>
      <Header />
      <main className="py-3">
        <Container>
          <h1>Enhange your image with Color Changer</h1>

          <ImageUploader />
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default App;
