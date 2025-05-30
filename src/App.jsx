import About from "./components/About";
import Contact from "./components/Contact";
import Features from "./components/Features";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Story from "./components/Story";

const App = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden ">
      <Hero />
      <Navbar />
      <About />
      <Features />
      <Story />
      <Contact />
    </main>
  );
};

export default App;
