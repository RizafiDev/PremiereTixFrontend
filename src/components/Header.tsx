import Carousel from "./Carousel";

const images = [
  {
    src: "https://asset.tix.id/microsite_v2/6db97041-a845-476a-8088-39997e1825d9.webp",
    title: "Nature",
    rating: 6.9,
  },
  {
    src: "https://asset.tix.id/microsite_v2/bfc3d262-7da6-4f46-b8b6-6f761174e128.webp",
    title: "City Life",
    rating: 6.9,
  },
  {
    src: "https://asset.tix.id/microsite_v2/12549415-9d58-4601-b746-97f046575a1b.webp",
    title: "Ocean",
    rating: 6.9,
  },
  {
    src: "https://asset.tix.id/microsite_v2/0b441ca3-d3ed-44f0-b412-35c311341cb4.webp",
    title: "Mountains",
    rating: 6.9,
  },
  {
    src: "https://asset.tix.id/microsite_v2/e7ae4905-af6a-4921-a8ac-eda0e8a6ec75.webp",
    title: "Mountains",
    rating: 6.9,
  },
];

function Header() {
  return (
    <header className="container mx-auto w-full">
      <Carousel images={images} />
    </header>
  );
}

export default Header;
