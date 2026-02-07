import Link from 'next/link';
import { SuperHero } from '../../interfaces/superhero.interface';


interface Props {
  hero: SuperHero
}

export default function SuperHeroCard({ hero }: Props) {


  return (
    <div className="rounded-xl shadow bg-white overflow-hidden">
      <div className="h-48 bg-gray-200">
        {hero.mainImage ? (
          <img
            src={hero.mainImage}
            alt={hero.nickname}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="p-4 text-black text-center font-semibold">

        <Link href={`/superheroes/${hero.id}`}>
          {hero.nickname}
        </Link>

      </div>
    </div>
  );
}
