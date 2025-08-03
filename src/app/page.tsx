import ProcTelibo from "./components/ProcTelibo";
import JakTeliboFunguje from "./components/jaktoFunguje/JakTeliboFunguje";
import Nav from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import UkazkaKnihy from "./components/Ukazkaknihy";
import ZjisteteVice from "./components/zjisteteVice/ZjistetVice";
import RecenzeSlider from "./components/recenze/RecenzeSlider";

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-[#EDFEFC] to-[#FEF6EC]">
      <Nav />
      <div className="mt-10">
        <HeroSection />
        <JakTeliboFunguje />
        <ProcTelibo />
        <UkazkaKnihy />
        <ZjisteteVice />
        <RecenzeSlider />
      </div>
    </div>
  );
}
