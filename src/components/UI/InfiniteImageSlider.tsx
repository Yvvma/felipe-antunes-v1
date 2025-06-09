const InfiniteImageSlider = () => {
  const images = [
        'https://res.cloudinary.com/dmgypxge0/image/upload/v1747981014/VOGUE_LOGO_grnkpt.png',
        'https://res.cloudinary.com/dmgypxge0/image/upload/v1747981643/gq_dipoea.svg',
        'https://res.cloudinary.com/dmgypxge0/image/upload/v1747907809/Lofficiel_logo_pr8hpr.svg',
        'https://res.cloudinary.com/dmgypxge0/image/upload/v1747983472/Harper_s_Bazaar_Logo.svg_i3aass.png',
        'https://res.cloudinary.com/dmgypxge0/image/upload/v1747983643/pngimg.com_-_calvin_klein_PNG7_a6cb46.png',
        'https://res.cloudinary.com/dmgypxge0/image/upload/v1747985244/C_A_logo.svg_t7kv79.png',
        
  ];

  return (
    <div className="relative w-full overflow-hidden py-6">
      {/* Left gradient */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#0c0c0c0] via-[#0c0c0c0]/50 to-transparent z-10" />
      {/* Right gradient */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#0c0c0c0] via-[#0c0c0c0]/50 to-transparent z-10" />

      {/* Slider */}
      <div className="flex min-w-48 animate-[scroll_15s_linear_infinite]">
        {[...images, ...images].map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Slide ${i}`}
            className="max-w-16 h-auto mx-4 object-contain invert"
          />
        ))}
      </div>
    </div>
  );
};

export default InfiniteImageSlider;