import Image from "next/image";
import type { GitHubContributor } from "@/lib/github";

const teamMembers = [
  {
    name: "Jubair Moaj",
    title: "CSE 61",
    imageUrl:
      "/dev-images/jm.jpg",
  },
  {
    name: "Rahat Jahan Redoy",
    title: "CSE 61",
    imageUrl:
      "/dev-images/ridoy.jpg",
  },
  {
    name: "Mushad Ajmee",
    title: "CSE 62",
    imageUrl:
      "/dev-images/saad.jpg",
  },
  {
    name: "Ferdous Hasan Rahid",
    title: "CSE 64",
    imageUrl:
      "/dev-images/rahid.webp",
  },
];

const gridClasses =
  "mx-auto mt-20 grid w-full max-w-(--breakpoint-lg) grid-cols-2 gap-12 sm:grid-cols-3 md:grid-cols-4";

type TeamProps = {
  contributors?: GitHubContributor[];
};

const Team = ({ contributors }: TeamProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl text-center">
        <b className="text-center font-semibold text-muted-foreground text-sm uppercase">
          Who We Are
        </b>
        <h2 className="mt-4 font-semibold text-4xl tracking-tighter sm:text-5xl">
          Meet The Contributors
        </h2>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          A passionate student team dedicated to the best SEU experience.
        </p>
      </div>

      <div className={gridClasses}>
        {teamMembers.map((member) => (
          <div className="text-center" key={member.name}>
            <Image
              alt={member.name}
              className="mx-auto h-20 w-20 rounded-full bg-secondary object-cover"
              height={120}
              src={member.imageUrl}
              width={120}
            />
            <h3 className="mt-4 font-semibold text-lg">{member.name}</h3>
          </div>
        ))}
        {contributors?.map((c) => (
          <a
            className="text-center transition-opacity hover:opacity-80"
            href={c.html_url}
            key={c.id}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              alt={c.login}
              className="mx-auto h-20 w-20 rounded-full bg-secondary object-cover"
              height={120}
              src={c.avatar_url}
              unoptimized
              width={120}
            />
            <h3 className="mt-4 font-semibold text-lg">{c.login}</h3>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Team;
