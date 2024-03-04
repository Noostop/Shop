import {HeaddingWithBgImage} from '~/components/Headding';

export default function Support() {
  return (
    <>
      <HeaddingWithBgImage
        title="增值服务"
        description="多种保障服务，全面安心守护"
        inverse
        bgImage={{
          url: 'https://dji-official-fe.djicdn.com/dps/bc8cacaffa11396080a730236ad49e06.jpg',
          width: 5120,
          height: 800,
          alt: '增值服务',
        }}
      />
      <div className="">
        <div className="h-screen bg-blue-500"></div>
        <div className="h-screen bg-blue-500"></div>
        <div className="h-screen bg-blue-500"></div>
      </div>
    </>
  );
}
