import Slider from '@/components/slider/slider';
import Bundles from '@/components/bundles/bundles';

export default function BundlesPage() {
  return (
    <>
      <section id="Intro" className="pt-20 pb-10">
        <div className="container">
          <div className="flex max-w-full md:mx-auto mx-4 relative mt-10">
            <div className="flex-1 relative">
              <p className="md:text-5xl text-3xl text-gray-font font-normal mb-4 font-caslon md:text-left text-center ">Self-guided purchase</p>
            </div>
          </div>
          <hr className="border-primary my-4 w-full" />
          <div className="flex max-w-full md:mx-auto mx-4 relative mt-4">
            <div className="flex-1 relative">
              <p className="md:text-2xl text-xl text-gray-font font-normal mb-4 md:text-left text-center ">All SunCore Custom Mining Bundles include:</p>
            </div>
          </div>
        </div>
      </section>

      <section id="Slider" className="pb-10">
        <Slider />
      </section>
      
      <Bundles />
    </>
  );
}