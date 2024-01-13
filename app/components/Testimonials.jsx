import {StarIcon} from '@heroicons/react/20/solid';

export function Testimonials() {
  return (
    <section className="px-6 py-24 bg-gray-100 sm:py-32 lg:px-8">
      <figure className="container">
        <p className="sr-only">5 out of 5 stars</p>
        <div className="flex text-yellow-500 gap-x-1">
          <StarIcon className="flex-none w-5 h-5" aria-hidden="true" />
          <StarIcon className="flex-none w-5 h-5" aria-hidden="true" />
          <StarIcon className="flex-none w-5 h-5" aria-hidden="true" />
          <StarIcon className="flex-none w-5 h-5" aria-hidden="true" />
          <StarIcon className="flex-none w-5 h-5" aria-hidden="true" />
        </div>
        <blockquote className="mt-10 text-xl font-semibold leading-8 tracking-tight text-gray-900 sm:text-2xl sm:leading-9">
          <p className='before:contents["“"]'>
            “Qui dolor enim consectetur do et non ex amet culpa sint in ea non
            dolore. Enim minim magna anim id minim eu cillum sunt dolore
            aliquip. Amet elit laborum culpa irure incididunt adipisicing culpa
            amet officia exercitation. Eu non aute velit id velit Lorem elit
            anim pariatur.”
          </p>
        </blockquote>
        <figcaption className="flex items-center mt-10 gap-x-6">
          <img
            className="w-12 h-12 rounded-full bg-gray-50"
            src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80"
            alt=""
          />
          <div className="text-sm leading-6">
            <div className="font-semibold text-gray-900">Judith Black</div>
            <div className="mt-0.5 text-gray-600">CEO of Workcation</div>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}
