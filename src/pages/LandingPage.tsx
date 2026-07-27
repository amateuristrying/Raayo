export function LandingPage() {
  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#040610]">
      <iframe
        src="/raayo-landing/index.html"
        className="h-full w-full border-0"
        title="RAAYO 3D WebGPU Landing Page"
      />
    </div>
  );
}
