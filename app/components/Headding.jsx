import clsx from 'clsx';

export function HeaddingWithEyebrow({title, description, eyebrow}) {
  return (
    <div className="px-6 py-24 bg-white sm:py-32 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {eyebrow && (
          <p className="text-base font-semibold leading-7 text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          {title}
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export function HeaddingWithBgImage({
  title,
  inverse = false,
  description,
  eyebrow,
  bgImage,
}) {
  return (
    <div
      className={clsx(
        'relative py-24 overflow-hidden bg-gray-900 isolate sm:py-32',
        inverse ? 'text-gray-900 bg-gray-100' : 'text-white bg-gray-900',
      )}
    >
      {bgImage && (
        <>
          <img
            src={bgImage.url}
            alt=""
            className="absolute inset-0 object-cover object-center w-full h-full -z-10"
          />
          {/* <div
            className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div
            className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
            aria-hidden="true"
          >
            <div
              className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div> */}
        </>
      )}
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="max-w-2xl mx-auto lg:mx-0">
          {eyebrow && (
            <p className="text-base font-semibold leading-7 text-primary">
              {eyebrow}
            </p>
          )}
          <h2
            className={clsx(
              'text-3xl font-bold tracking-tight sm:text-6xl',
              inverse ? 'text-gray-900' : 'text-white',
            )}
          >
            {title}
          </h2>
          <p
            className={clsx(
              'mt-6 text-base md:text-lg leading-8',
              inverse ? 'text-gray-800' : 'text-gray-300',
            )}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
