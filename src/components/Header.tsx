import Carousel from "./Carousel";

const images = [
  {
    src: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    title: "Nature",
    rating: 6.9,
  },
  {
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    title: "City Life",
    rating: 6.9,
  },
  {
    src: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
    title: "Ocean",
    rating: 6.9,
  },
  {
    src: "https://images.unsplash.com/photo-1499084732479-de2c02d45fcc",
    title: "Mountains",
    rating: 6.9,
  },
];

function Header() {
  return (
    <header className="w-full">
      <Carousel images={images} />
    </header>
  );
}

export default Header;
