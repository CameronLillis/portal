<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        $people = [
            ['Ava Nguyen', 'ava@demo.com', 'Neon Ninjas', 'Software', 'Pending'],
            ['Mateo Rivera', 'mateo@demo.com', 'Circuit Cowboys', 'Hardware', 'Checked In'],
            ['Sofia Patel', 'sofia@demo.com', 'Desert Debuggers', 'Software', 'Pending'],
        ];

        foreach ($people as [$name, $email, $team, $track, $state]) {
            $user = new User();
            $user->setName($name);
            $user->setEmail($email);
            $user->setTeam($team);
            $user->setTrack($track);
            $user->setState($state);

            // IMPORTANT (you already hit this earlier)
            $user->setRoles(['ROLE_USER']);

            // set a password so login works
            $user->setPassword(
                $this->passwordHasher->hashPassword($user, 'password')
            );

            $manager->persist($user);
        }

        $manager->flush();
    }
}
