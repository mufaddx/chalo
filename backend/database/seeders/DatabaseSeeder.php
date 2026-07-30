<?php

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\Category;
use App\Models\Destination;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // -- Admin --------------------------------------------------------
        User::create([
            'name' => 'Voyagr Admin',
            'email' => 'admin@voyagr.test',
            'password' => 'password',
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // -- Categories (matches lib/data.ts on the frontend) --------------
        $categories = [
            ['Domestic', 'MapPin'], ['International', 'Globe2'], ['Adventure', 'MountainSnow'],
            ['Family', 'Users'], ['Solo', 'UserRound'], ['Honeymoon', 'Heart'],
            ['Luxury', 'Gem'], ['Budget', 'Wallet'], ['Wildlife', 'PawPrint'],
            ['Hill Station', 'Trees'], ['Beach', 'Waves'], ['Weekend Trips', 'CalendarDays'],
            ['Cruise', 'Ship'], ['Road Trip', 'Car'],
        ];
        foreach ($categories as $i => [$name, $icon]) {
            Category::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'icon' => $icon,
                'sort_order' => $i,
            ]);
        }

        // -- Destinations ---------------------------------------------------
        $destinations = [
            ['Ladakh', 'India', 34.15, 77.58],
            ['Goa', 'India', 15.29, 74.12],
            ['Kerala Backwaters', 'India', 9.49, 76.33],
            ['Bali', 'Indonesia', -8.34, 115.09],
            ['Santorini', 'Greece', 36.39, 25.46],
            ['Swiss Alps', 'Switzerland', 46.55, 7.98],
            ['Rajasthan', 'India', 26.91, 75.79],
            ['Vietnam', 'Vietnam', 14.06, 108.28],
        ];
        $destinationModels = [];
        foreach ($destinations as [$name, $country, $lat, $lng]) {
            $destinationModels[$name] = Destination::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'country' => $country,
                'latitude' => $lat,
                'longitude' => $lng,
            ]);
        }

        // -- Agencies (owners + profiles) -----------------------------------
        $agencyDefs = [
            ['High Altitude Expeditions', 'Leh, Ladakh', 14, 4.8],
            ['Sunseeker Holidays', 'Panjim, Goa', 9, 4.6],
            ['Backwater Trails', 'Alleppey, Kerala', 11, 4.9],
            ['Meridian Getaways', 'Mumbai, Maharashtra', 17, 4.7],
            ['Royal Rajasthan Tours', 'Jaipur, Rajasthan', 22, 4.8],
        ];
        $agencyModels = [];
        foreach ($agencyDefs as [$name, $city, $years, $rating]) {
            $owner = User::create([
                'name' => $name.' Owner',
                'email' => Str::slug($name).'@voyagr.test',
                'password' => 'password',
                'role' => 'agency',
                'email_verified_at' => now(),
            ]);

            $agencyModels[$name] = Agency::create([
                'user_id' => $owner->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'city' => $city,
                'years_experience' => $years,
                'rating_avg' => $rating,
                'status' => 'verified',
                'verified_at' => now(),
            ]);
        }

        // -- One fully worked example tour, so `php artisan db:seed` gives
        //    you something real to click through immediately. Add more via
        //    the agency dashboard once auth is wired to a frontend.
        $tour = Tour::create([
            'agency_id' => $agencyModels['High Altitude Expeditions']->id,
            'destination_id' => $destinationModels['Ladakh']->id,
            'title' => 'Ladakh: Monasteries & High Mountain Passes',
            'slug' => 'ladakh-monasteries-and-passes',
            'description' => 'A small-group road trip across the Himalayas, from Leh\'s monasteries to Pangong Tso.',
            'price' => 34999,
            'original_price' => 42999,
            'duration_nights' => 6,
            'duration_days' => 7,
            'hotel_rating' => 3,
            'transport' => ['Flight', 'Cab'],
            'meals_included' => true,
            'free_cancellation' => true,
            'instant_confirmation' => false,
            'highlights' => [
                'Cross Khardung La, one of the world\'s highest motorable passes',
                'Overnight stay beside Pangong Tso',
                'Guided monastery circuit: Thiksey, Hemis and Diskit',
            ],
            'inclusions' => ['6 nights accommodation', 'Daily breakfast and dinner', 'Inner line permits'],
            'exclusions' => ['Airfare to Leh', 'Lunches', 'Travel insurance'],
            'things_to_carry' => ['Warm layered clothing', 'Sunscreen SPF 50+'],
            'status' => 'published',
            'featured' => true,
            'trending' => true,
            'approved_at' => now(),
        ]);

        $tour->categories()->attach(Category::whereIn('slug', ['adventure', 'domestic'])->pluck('id'));

        $tour->itineraryDays()->createMany([
            ['day_number' => 1, 'title' => 'Arrive in Leh, acclimatisation', 'description' => 'Land in Leh and rest at low altitude.', 'meals' => ['Dinner'], 'stay_name' => 'Hotel in Leh'],
            ['day_number' => 2, 'title' => 'Leh local monasteries', 'description' => 'Visit Shanti Stupa, Hemis and Thiksey.', 'meals' => ['Breakfast', 'Dinner'], 'stay_name' => 'Hotel in Leh'],
            ['day_number' => 3, 'title' => 'Leh to Nubra Valley via Khardung La', 'description' => 'Cross Khardung La and descend into Nubra.', 'meals' => ['Breakfast', 'Dinner'], 'stay_name' => 'Camp in Nubra'],
        ]);

        $tour->tourDates()->createMany([
            ['departure_date' => now()->addDays(14), 'seats_total' => 12, 'seats_available' => 4, 'status' => 'open'],
            ['departure_date' => now()->addDays(21), 'seats_total' => 12, 'seats_available' => 12, 'status' => 'open'],
        ]);

        $this->command?->info('Seeded: 1 admin, 5 agencies, 14 categories, 8 destinations, 1 full tour.');
    }
}
