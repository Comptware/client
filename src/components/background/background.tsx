import Image from "next/image";

interface BackgroundProps {
  image: string;
}

const Background = ({ image }: BackgroundProps) => {
  return (
    <div className="absolute left-0 right-0 bottom-0 top-0 -z-10">
      <Image
        src={`${process.env.NEXT_PUBLIC_CDN_URL}${image}`}
        fill
        className="object-cover"
        quality={100}
        alt="background"
      />
    </div>
  );
};

export default Background;