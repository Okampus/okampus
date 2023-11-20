import { AmenityType } from '@prisma/client';

export const placeCategoryToAmenityType = {
  accommodation: AmenityType.Accommodation,
  'accommodation.hotel': AmenityType.Hotel,
  'accommodation.hut': AmenityType.Hut,
  'accommodation.apartment': AmenityType.Apartment,
  'accommodation.chalet': AmenityType.Chalet,
  'accommodation.guest_house': AmenityType.GuestHouse,
  'accommodation.hostel': AmenityType.Hostel,
  'accommodation.motel': AmenityType.Motel,
  activity: AmenityType.Activity,
  'activity.community_center': AmenityType.CommunityCenter,
  'activity.sport_club': AmenityType.SportClub,
  commercial: AmenityType.Commercial,
  'commercial.supermarket': AmenityType.Supermarket,
  'commercial.marketplace': AmenityType.Marketplace,
  'commercial.shopping_mall': AmenityType.ShoppingMall,
  'commercial.department_store': AmenityType.DepartmentStore,
  'commercial.elektronics': AmenityType.Electronics,
  'commercial.outdoor_and_sport': AmenityType.OutdoorAndSport,
  'commercial.outdoor_and_sport.water_sports': AmenityType.WaterSports,
  'commercial.outdoor_and_sport.ski': AmenityType.Ski,
  'commercial.outdoor_and_sport.diving': AmenityType.Diving,
  'commercial.outdoor_and_sport.hunting': AmenityType.Hunting,
  'commercial.outdoor_and_sport.bicycle': AmenityType.Bicycle,
  'commercial.outdoor_and_sport.fishing': AmenityType.Fishing,
  'commercial.outdoor_and_sport.golf': AmenityType.Golf,
  'commercial.vehicle': AmenityType.Vehicle,
  'commercial.hobby': AmenityType.Hobby,
  'commercial.hobby.model': AmenityType.Model,
  'commercial.hobby.anime': AmenityType.Anime,
  'commercial.hobby.collecting': AmenityType.Collecting,
  'commercial.hobby.games': AmenityType.Games,
  'commercial.hobby.brewing': AmenityType.Brewing,
  'commercial.hobby.photo': AmenityType.Photo,
  'commercial.hobby.music': AmenityType.Music,
  'commercial.hobby.sewing_and_knitting': AmenityType.SewingAndKnitting,
  'commercial.hobby.art': AmenityType.HobbyArtShop,
  'commercial.books': AmenityType.Books,
  'commercial.gift_and_souvenir': AmenityType.GiftAndSouvenir,
  'commercial.stationery': AmenityType.Stationery,
  'commercial.newsagent': AmenityType.Newsagent,
  'commercial.tickets_and_lottery': AmenityType.TicketsAndLottery,
  'commercial.clothing': AmenityType.Clothing,
  'commercial.clothing.shoes': AmenityType.Shoes,
  'commercial.clothing.clothes': AmenityType.Clothes,
  'commercial.clothing.underwear': AmenityType.Underwear,
  'commercial.clothing.sport': AmenityType.Sport,
  'commercial.clothing.men': AmenityType.Men,
  'commercial.clothing.women': AmenityType.Women,
  'commercial.clothing.kids': AmenityType.Kids,
  'commercial.clothing.accessories': AmenityType.Accessories,
  'commercial.bag': AmenityType.Bag,
  'commercial.baby_goods': AmenityType.BabyGoods,
  'commercial.agrarian': AmenityType.Agrarian,
  'commercial.garden': AmenityType.Garden,
  'commercial.houseware_and_hardware': AmenityType.HousewareAndHardware,
  'commercial.houseware_and_hardware.doityourself': AmenityType.DoItYourself,
  'commercial.houseware_and_hardware.hardware_and_tools': AmenityType.HardwareAndTools,
  'commercial.houseware_and_hardware.building_materials': AmenityType.BuildingMaterials,
  'commercial.houseware_and_hardware.building_materials.paint': AmenityType.Paint,
  'commercial.houseware_and_hardware.building_materials.glaziery': AmenityType.Glaziery,
  'commercial.houseware_and_hardware.building_materials.doors': AmenityType.Doors,
  'commercial.houseware_and_hardware.building_materials.tiles': AmenityType.Tiles,
  'commercial.houseware_and_hardware.building_materials.windows': AmenityType.Windows,
  'commercial.houseware_and_hardware.building_materials.flooring': AmenityType.Flooring,
  'commercial.houseware_and_hardware.fireplace': AmenityType.Fireplace,
  'commercial.houseware_and_hardware.swimming_pool': AmenityType.SwimmingPool,
  'commercial.florist': AmenityType.Florist,
  'commercial.furniture_and_interior': AmenityType.FurnitureAndInterior,
  'commercial.furniture_and_interior.lighting': AmenityType.Lighting,
  'commercial.furniture_and_interior.curtain': AmenityType.Curtain,
  'commercial.furniture_and_interior.carpet': AmenityType.Carpet,
  'commercial.furniture_and_interior.kitchen': AmenityType.Kitchen,
  'commercial.furniture_and_interior.bed': AmenityType.Bed,
  'commercial.furniture_and_interior.bathroom': AmenityType.Bathroom,
  'commercial.chemist': AmenityType.Chemist,
  'commercial.health_and_beauty': AmenityType.HealthAndBeauty,
  'commercial.health_and_beauty.pharmacy': AmenityType.Pharmacy,
  'commercial.health_and_beauty.optician': AmenityType.Optician,
  'commercial.health_and_beauty.medical_supply': AmenityType.MedicalSupply,
  'commercial.health_and_beauty.hearing_aids': AmenityType.HearingAids,
  'commercial.health_and_beauty.herbalist': AmenityType.Herbalist,
  'commercial.health_and_beauty.cosmetics': AmenityType.Cosmetics,
  'commercial.health_and_beauty.wigs': AmenityType.Wigs,
  'commercial.toy_and_game': AmenityType.ToyAndGame,
  'commercial.pet': AmenityType.Pet,
  'commercial.food_and_drink': AmenityType.FoodAndDrink,
  'commercial.food_and_drink.bakery': AmenityType.Bakery,
  'commercial.food_and_drink.deli': AmenityType.Deli,
  'commercial.food_and_drink.frozen_food': AmenityType.FrozenFood,
  'commercial.food_and_drink.pasta': AmenityType.Pasta,
  'commercial.food_and_drink.spices': AmenityType.Spices,
  'commercial.food_and_drink.organic': AmenityType.Organic,
  'commercial.food_and_drink.honey': AmenityType.HoneyStore,
  'commercial.food_and_drink.rice': AmenityType.RiceStore,
  'commercial.food_and_drink.nuts': AmenityType.NutsStore,
  'commercial.food_and_drink.health_food': AmenityType.HealthFoodStore,
  'commercial.food_and_drink.ice_cream': AmenityType.IceCreamStore,
  'commercial.food_and_drink.seafood': AmenityType.RestaurantSeafood,
  'commercial.food_and_drink.fruit_and_vegetable': AmenityType.FruitAndVegetable,
  'commercial.food_and_drink.farm': AmenityType.Farm,
  'commercial.food_and_drink.confectionery': AmenityType.Confectionery,
  'commercial.food_and_drink.chocolate': AmenityType.Chocolate,
  'commercial.food_and_drink.butcher': AmenityType.Butcher,
  'commercial.food_and_drink.cheese_and_dairy': AmenityType.CheeseAndDairy,
  'commercial.food_and_drink.drinks': AmenityType.Drinks,
  'commercial.food_and_drink.coffee_and_tea': AmenityType.CoffeeAndTea,
  'commercial.convenience': AmenityType.Convenience,
  'commercial.discount_store': AmenityType.DiscountStore,
  'commercial.smoking': AmenityType.Smoking,
  'commercial.second_hand': AmenityType.SecondHand,
  'commercial.gas': AmenityType.Gas,
  'commercial.weapons': AmenityType.Weapons,
  'commercial.pyrotechnics': AmenityType.Pyrotechnics,
  'commercial.energy': AmenityType.Energy,
  'commercial.wedding': AmenityType.Wedding,
  'commercial.jewelry': AmenityType.Jewelry,
  'commercial.watches': AmenityType.Watches,
  'commercial.art': AmenityType.ArtStore,
  'commercial.antiques': AmenityType.AntiqueStore,
  'commercial.video_and_music': AmenityType.VideoAndMusic,
  'commercial.erotic': AmenityType.Erotic,
  'commercial.trade': AmenityType.Trade,
  'commercial.kiosk': AmenityType.Kiosk,
  catering: AmenityType.Catering,
  'catering.restaurant': AmenityType.Restaurant,
  'catering.restaurant.steak_house': AmenityType.SteakHouse,
  'catering.restaurant.pizza': AmenityType.RestaurantPizza,
  'catering.restaurant.burger': AmenityType.RestaurantBurger,
  'catering.restaurant.regional': AmenityType.RestaurantRegional,
  'catering.restaurant.italian': AmenityType.RestaurantItalian,
  'catering.restaurant.chinese': AmenityType.RestaurantChinese,
  'catering.restaurant.sandwich': AmenityType.RestaurantSandwich,
  'catering.restaurant.chicken': AmenityType.RestaurantChicken,
  'catering.restaurant.mexican': AmenityType.RestaurantMexican,
  'catering.restaurant.japanese': AmenityType.RestaurantJapanese,
  'catering.restaurant.american': AmenityType.RestaurantAmerican,
  'catering.restaurant.kebab': AmenityType.RestaurantKebab,
  'catering.restaurant.indian': AmenityType.RestaurantIndian,
  'catering.restaurant.asian': AmenityType.RestaurantAsian,
  'catering.restaurant.sushi': AmenityType.RestaurantSushi,
  'catering.restaurant.french': AmenityType.RestaurantFrench,
  'catering.restaurant.german': AmenityType.RestaurantGerman,
  'catering.restaurant.thai': AmenityType.RestaurantThai,
  'catering.restaurant.greek': AmenityType.RestaurantGreek,
  'catering.restaurant.seafood': AmenityType.RestaurantSeafood,
  'catering.restaurant.fish_and_chips': AmenityType.RestaurantFishAndChips,
  'catering.restaurant.international': AmenityType.RestaurantInternational,
  'catering.restaurant.tex-mex': AmenityType.RestaurantTexMex,
  'catering.restaurant.vietnamese': AmenityType.RestaurantVietnamese,
  'catering.restaurant.turkish': AmenityType.RestaurantTurkish,
  'catering.restaurant.korean': AmenityType.RestaurantKorean,
  'catering.restaurant.noodle': AmenityType.RestaurantNoodle,
  'catering.restaurant.barbecue': AmenityType.RestaurantBarbecue,
  'catering.restaurant.spanish': AmenityType.RestaurantSpanish,
  'catering.restaurant.fish': AmenityType.RestaurantFish,
  'catering.restaurant.ramen': AmenityType.RestaurantRamen,
  'catering.restaurant.mediterranean': AmenityType.RestaurantMediterranean,
  'catering.restaurant.friture': AmenityType.RestaurantFriture,
  'catering.restaurant.beef_bowl': AmenityType.RestaurantBeefBowl,
  'catering.restaurant.lebanese': AmenityType.RestaurantLebanese,
  'catering.restaurant.wings': AmenityType.RestaurantWings,
  'catering.restaurant.georgian': AmenityType.RestaurantGeorgian,
  'catering.restaurant.tapas': AmenityType.RestaurantTapas,
  'catering.restaurant.indonesian': AmenityType.RestaurantIndonesian,
  'catering.restaurant.arab': AmenityType.RestaurantArab,
  'catering.restaurant.portuguese': AmenityType.RestaurantPortuguese,
  'catering.restaurant.russian': AmenityType.RestaurantRussian,
  'catering.restaurant.filipino': AmenityType.RestaurantFilipino,
  'catering.restaurant.african': AmenityType.RestaurantAfrican,
  'catering.restaurant.malaysian': AmenityType.RestaurantMalaysian,
  'catering.restaurant.caribbean': AmenityType.RestaurantCaribbean,
  'catering.restaurant.peruvian': AmenityType.RestaurantPeruvian,
  'catering.restaurant.bavarian': AmenityType.RestaurantBavarian,
  'catering.restaurant.brazilian': AmenityType.RestaurantBrazilian,
  'catering.restaurant.curry': AmenityType.RestaurantCurry,
  'catering.restaurant.dumpling': AmenityType.RestaurantDumpling,
  'catering.restaurant.persian': AmenityType.RestaurantPersian,
  'catering.restaurant.argentinian': AmenityType.RestaurantArgentinian,
  'catering.restaurant.oriental': AmenityType.RestaurantOriental,
  'catering.restaurant.balkan': AmenityType.RestaurantBalkan,
  'catering.restaurant.moroccan': AmenityType.RestaurantMoroccan,
  'catering.restaurant.pita': AmenityType.RestaurantPita,
  'catering.restaurant.ethiopian': AmenityType.RestaurantEthiopian,
  'catering.restaurant.taiwanese': AmenityType.RestaurantTaiwanese,
  'catering.restaurant.latin_american': AmenityType.RestaurantLatinAmerican,
  'catering.restaurant.hawaiian': AmenityType.RestaurantHawaiian,
  'catering.restaurant.irish': AmenityType.RestaurantIrish,
  'catering.restaurant.austrian': AmenityType.RestaurantAustrian,
  'catering.restaurant.croatian': AmenityType.RestaurantCroatian,
  'catering.restaurant.danish': AmenityType.RestaurantDanish,
  'catering.restaurant.tacos': AmenityType.RestaurantTacos,
  'catering.restaurant.bolivian': AmenityType.RestaurantBolivian,
  'catering.restaurant.hungarian': AmenityType.RestaurantHungarian,
  'catering.restaurant.western': AmenityType.RestaurantWestern,
  'catering.restaurant.european': AmenityType.RestaurantEuropean,
  'catering.restaurant.jamaican': AmenityType.RestaurantJamaican,
  'catering.restaurant.cuban': AmenityType.RestaurantCuban,
  'catering.restaurant.soup': AmenityType.RestaurantSoup,
  'catering.restaurant.uzbek': AmenityType.RestaurantUzbek,
  'catering.restaurant.nepalese': AmenityType.RestaurantNepalese,
  'catering.restaurant.czech': AmenityType.RestaurantCzech,
  'catering.restaurant.syrian': AmenityType.RestaurantSyrian,
  'catering.restaurant.afghan': AmenityType.RestaurantAfghan,
  'catering.restaurant.malay': AmenityType.RestaurantMalay,
  'catering.restaurant.chili': AmenityType.Chili,
  'catering.restaurant.belgian': AmenityType.RestaurantBelgian,
  'catering.restaurant.ukrainian': AmenityType.RestaurantUkrainian,
  'catering.restaurant.swedish': AmenityType.RestaurantSwedish,
  'catering.restaurant.pakistani': AmenityType.RestaurantPakistani,
  'catering.fast_food': AmenityType.FastFood,
  'catering.fast_food.pizza': AmenityType.FastFoodPizza,
  'catering.fast_food.burger': AmenityType.FastFoodBurger,
  'catering.fast_food.sandwich': AmenityType.FastFoodSandwich,
  'catering.fast_food.kebab': AmenityType.FastFoodKebab,
  'catering.fast_food.fish_and_chips': AmenityType.FastFoodFishAndChips,
  'catering.fast_food.noodle': AmenityType.FastFoodNoodle,
  'catering.fast_food.ramen': AmenityType.RestaurantRamen,
  'catering.fast_food.wings': AmenityType.FastFoodWings,
  'catering.fast_food.tapas': AmenityType.FastFoodTapas,
  'catering.fast_food.pita': AmenityType.FastFoodPita,
  'catering.fast_food.tacos': AmenityType.FastFoodTacos,
  'catering.fast_food.soup': AmenityType.FastFoodSoup,
  'catering.fast_food.salad': AmenityType.FastFoodSalad,
  'catering.fast_food.hot_dog': AmenityType.FastFoodHotDog,
  'catering.cafe': AmenityType.Cafe,
  'catering.cafe.ice_cream': AmenityType.IceCreamShop,
  'catering.cafe.waffle': AmenityType.WaffleShop,
  'catering.cafe.coffee_shop': AmenityType.CoffeeShop,
  'catering.cafe.donut': AmenityType.DonutShop,
  'catering.cafe.crepe': AmenityType.CrepeShop,
  'catering.cafe.bubble_tea': AmenityType.BubbleTeaShop,
  'catering.cafe.cake': AmenityType.CakeShop,
  'catering.cafe.frozen_yogurt': AmenityType.FrozenYogurtShop,
  'catering.cafe.dessert': AmenityType.DessertShop,
  'catering.cafe.coffee': AmenityType.Coffee,
  'catering.cafe.tea': AmenityType.Tea,
  'catering.food_court': AmenityType.FoodCourt,
  'catering.bar': AmenityType.Bar,
  'catering.pub': AmenityType.Pub,
  'catering.ice_cream': AmenityType.IceCreamStore,
  'catering.biergarten': AmenityType.Biergarten,
  'catering.taproom': AmenityType.Taproom,
  education: AmenityType.Education,
  'education.school': AmenityType.School,
  'education.driving_school': AmenityType.DrivingSchool,
  'education.music_school': AmenityType.MusicSchool,
  'education.language_school': AmenityType.LanguageSchool,
  'education.library': AmenityType.Library,
  'education.college': AmenityType.College,
  'education.university': AmenityType.University,
  childcare: AmenityType.Childcare,
  'childcare.kindergarten': AmenityType.Kindergarten,
  entertainment: AmenityType.Entertainment,
  'entertainment.culture': AmenityType.Culture,
  'entertainment.culture.theatre': AmenityType.Theatre,
  'entertainment.culture.arts_centre': AmenityType.ArtsCenter,
  'entertainment.culture.gallery': AmenityType.Gallery,
  'entertainment.zoo': AmenityType.Zoo,
  'entertainment.aquarium': AmenityType.Aquarium,
  'entertainment.planetarium': AmenityType.Planetarium,
  'entertainment.museum': AmenityType.Museum,
  'entertainment.cinema': AmenityType.Cinema,
  'entertainment.amusement_arcade': AmenityType.AmusementArcade,
  'entertainment.escape_game': AmenityType.EscapeGame,
  'entertainment.miniature_golf': AmenityType.MiniatureGolf,
  'entertainment.bowling_alley': AmenityType.BowlingAlley,
  'entertainment.flying_fox': AmenityType.FlyingFox,
  'entertainment.theme_park': AmenityType.ThemePark,
  'entertainment.water_park': AmenityType.WaterPark,
  'entertainment.activity_park': AmenityType.ActivityPark,
  'entertainment.activity_park.trampoline': AmenityType.ActivityParkTrampoline,
  'entertainment.activity_park.climbing': AmenityType.ActivityParkClimbing,
  healthcare: AmenityType.Healthcare,
  'healthcare.clinic_or_praxis': AmenityType.ClinicOrPraxis,
  'healthcare.clinic_or_praxis.allergology': AmenityType.Allergology,
  'healthcare.clinic_or_praxis.vascular_surgery': AmenityType.VascularSurgery,
  'healthcare.clinic_or_praxis.urology': AmenityType.Urology,
  'healthcare.clinic_or_praxis.trauma': AmenityType.Trauma,
  'healthcare.clinic_or_praxis.rheumatology': AmenityType.Rheumatology,
  'healthcare.clinic_or_praxis.radiology': AmenityType.Radiology,
  'healthcare.clinic_or_praxis.pulmonology': AmenityType.Pulmonology,
  'healthcare.clinic_or_praxis.psychiatry': AmenityType.Psychiatry,
  'healthcare.clinic_or_praxis.paediatrics': AmenityType.Paediatrics,
  'healthcare.clinic_or_praxis.otolaryngology': AmenityType.Otolaryngology,
  'healthcare.clinic_or_praxis.orthopaedics': AmenityType.Orthopaedics,
  'healthcare.clinic_or_praxis.ophthalmology': AmenityType.Ophthalmology,
  'healthcare.clinic_or_praxis.occupational': AmenityType.Occupational,
  'healthcare.clinic_or_praxis.gynaecology': AmenityType.Gynaecology,
  'healthcare.clinic_or_praxis.general': AmenityType.General,
  'healthcare.clinic_or_praxis.gastroenterology': AmenityType.Gastroenterology,
  'healthcare.clinic_or_praxis.endocrinology': AmenityType.Endocrinology,
  'healthcare.clinic_or_praxis.dermatology': AmenityType.Dermatology,
  'healthcare.clinic_or_praxis.cardiology': AmenityType.Cardiology,
  'healthcare.dentist': AmenityType.Dentist,
  'healthcare.dentist.orthodontics': AmenityType.DentistOrthodontics,
  'healthcare.hospital': AmenityType.Hospital,
  'healthcare.pharmacy': AmenityType.Pharmacy,
  heritage: AmenityType.Heritage,
  'heritage.unesco': AmenityType.UNESCO,
  leisure: AmenityType.Leisure,
  'leisure.picnic': AmenityType.Picnic,
  'leisure.picnic.picnic_site': AmenityType.PicnicSite,
  'leisure.picnic.picnic_table': AmenityType.PicnicTable,
  'leisure.picnic.bbq': AmenityType.BBQ,
  'leisure.playground': AmenityType.Playground,
  'leisure.spa': AmenityType.Spa,
  'leisure.spa.public_bath': AmenityType.SpaPublicBath,
  'leisure.spa.sauna': AmenityType.SpaSauna,
  'leisure.park': AmenityType.Park,
  'leisure.park.garden': AmenityType.Garden,
  'leisure.park.nature_reserve': AmenityType.NatureReserve,
  man_made: AmenityType.ManMade,
  'man_made.pier': AmenityType.Pier,
  'man_made.breakwater': AmenityType.Breakwater,
  'man_made.tower': AmenityType.Tower,
  'man_made.water_tower': AmenityType.WaterTower,
  'man_made.bridge': AmenityType.Bridge,
  'man_made.lighthouse': AmenityType.Lighthouse,
  'man_made.windmill': AmenityType.Windmill,
  'man_made.watermill': AmenityType.Watermill,
  natural: AmenityType.Natural,
  'natural.forest': AmenityType.Forest,
  'natural.water': AmenityType.Water,
  'natural.water.spring': AmenityType.WaterSpring,
  'natural.water.reef': AmenityType.WaterReef,
  'natural.water.hot_spring': AmenityType.WaterHotSpring,
  'natural.water.geyser': AmenityType.WaterGeyser,
  'natural.water.sea': AmenityType.WaterSea,
  'natural.mountain': AmenityType.Mountain,
  'natural.mountain.peak': AmenityType.MountainPeak,
  'natural.mountain.glacier': AmenityType.MountainGlacier,
  'natural.mountain.cliff': AmenityType.MountainCliff,
  'natural.mountain.rock': AmenityType.MountainRock,
  'natural.mountain.cave_entrance': AmenityType.MountainCaveEntrance,
  'natural.sand': AmenityType.Sand,
  'natural.sand.dune': AmenityType.SandDune,
  'natural.protected_area': AmenityType.ProtectedArea,
  national_park: AmenityType.NationalPark,
  office: AmenityType.Office,
  'office.government': AmenityType.Government,
  'office.government.administrative': AmenityType.GovernmentAdministrative,
  'office.government.register_office': AmenityType.GovernmentRegisterOffice,
  'office.government.tax': AmenityType.GovernmentTax,
  'office.government.public_service': AmenityType.GovernmentPublicService,
  'office.government.ministry': AmenityType.GovernmentMinistry,
  'office.government.healthcare': AmenityType.GovernmentHealthcare,
  'office.government.prosecutor': AmenityType.GovernmentProsecutor,
  'office.government.transportation': AmenityType.GovernmentTransportation,
  'office.government.social_services': AmenityType.GovernmentSocialServices,
  'office.government.legislative': AmenityType.GovernmentLegislative,
  'office.government.education': AmenityType.GovernmentEducation,
  'office.government.customs': AmenityType.GovernmentCustoms,
  'office.government.social_security': AmenityType.GovernmentSocialSecurity,
  'office.government.environment': AmenityType.GovernmentEnvironment,
  'office.government.migration': AmenityType.GovernmentMigration,
  'office.government.cadaster': AmenityType.GovernmentCadaster,
  'office.government.forestry': AmenityType.GovernmentForestry,
  'office.government.agriculture': AmenityType.GovernmentAgriculture,
  'office.company': AmenityType.Company,
  'office.estate_agent': AmenityType.EstateAgent,
  'office.insurance': AmenityType.Insurance,
  'office.lawyer': AmenityType.Lawyer,
  'office.telecommunication': AmenityType.Telecommunication,
  'office.educational_institution': AmenityType.EducationalInstitution,
  'office.association': AmenityType.Association,
  'office.non_profit': AmenityType.NonProfit,
  'office.diplomatic': AmenityType.Diplomatic,
  'office.it': AmenityType.IT,
  'office.accountant': AmenityType.Accountant,
  'office.employment_agency': AmenityType.EmploymentAgency,
  'office.religion': AmenityType.Religion,
  'office.research': AmenityType.Research,
  'office.architect': AmenityType.Architect,
  'office.financial': AmenityType.Financial,
  'office.tax_advisor': AmenityType.TaxAdvisor,
  'office.advertising_agency': AmenityType.AdvertisingAgency,
  'office.notary': AmenityType.Notary,
  'office.newspaper': AmenityType.Newspaper,
  'office.political_party': AmenityType.PoliticalParty,
  'office.logistics': AmenityType.Logistics,
  'office.energy_supplier': AmenityType.EnergySupplier,
  'office.travel_agent': AmenityType.TravelAgent,
  'office.financial_advisor': AmenityType.FinancialAdvisor,
  'office.consulting': AmenityType.Consulting,
  'office.foundation': AmenityType.Foundation,
  'office.coworking': AmenityType.Coworking,
  'office.water_utility': AmenityType.WaterUtility,
  'office.forestry': AmenityType.Forestry,
  'office.charity': AmenityType.Charity,
  'office.security': AmenityType.Security,
  parking: AmenityType.Parking,
  'parking.cars': AmenityType.ParkingCars,
  'parking.cars.surface': AmenityType.ParkingCarsSurface,
  'parking.cars.multistorey': AmenityType.ParkingCarsMultistorey,
  'parking.cars.underground': AmenityType.ParkingCarsUnderground,
  'parking.cars.rooftop': AmenityType.ParkingCarsRooftop,
  'parking.surface': AmenityType.ParkingSurface,
  'parking.multistorey': AmenityType.ParkingMultistorey,
  'parking.underground': AmenityType.ParkingUnderground,
  'parking.rooftop': AmenityType.ParkingRooftop,
  'parking.motorcycle': AmenityType.ParkingMotorcycle,
  'parking.bicycles': AmenityType.ParkingBicycles,
  pet: AmenityType.Pet,
  'pet.shop': AmenityType.PetShop,
  'pet.veterinary': AmenityType.PetVeterinary,
  'pet.service': AmenityType.PetService,
  'pet.dog_park': AmenityType.PetDogPark,
  rental: AmenityType.Rental,
  'rental.car': AmenityType.RentalCar,
  'rental.storage': AmenityType.RentalStorage,
  'rental.bicycle': AmenityType.RentalBicycle,
  'rental.boat': AmenityType.RentalBoat,
  'rental.ski': AmenityType.RentalSki,
  service: AmenityType.Service,
  'service.financial': AmenityType.FinancialService,
  'service.financial.atm': AmenityType.ATM,
  'service.financial.payment_terminal': AmenityType.PaymentTerminal,
  'service.financial.bank': AmenityType.Bank,
  'service.financial.bureau_de_change': AmenityType.BureauDeChange,
  'service.financial.money_transfer': AmenityType.MoneyTransfer,
  'service.financial.money_lender': AmenityType.MoneyLender,
  'service.cleaning': AmenityType.CleaningService,
  'service.cleaning.lavoir': AmenityType.Lavoir,
  'service.cleaning.laundry': AmenityType.Laundry,
  'service.cleaning.dry_cleaning': AmenityType.DryCleaning,
  'service.travel_agency': AmenityType.TravelAgency,
  'service.post': AmenityType.PostService,
  'service.post.office': AmenityType.PostOffice,
  'service.post.box': AmenityType.PostBox,
  'service.police': AmenityType.Police,
  'service.vehicle': AmenityType.VehicleService,
  'service.vehicle.fuel': AmenityType.FuelStation,
  'service.vehicle.car_wash': AmenityType.CarWash,
  'service.vehicle.charging_station': AmenityType.ChargingStation,
  'service.vehicle.repair': AmenityType.VehicleRepair,
  'service.vehicle.repair.car': AmenityType.CarRepair,
  'service.vehicle.repair.motorcycle': AmenityType.MotorcycleRepair,
  'service.beauty': AmenityType.BeautyService,
  'service.beauty.hairdresser': AmenityType.Hairdresser,
  'service.beauty.spa': AmenityType.Spa,
  'service.beauty.massage': AmenityType.Massage,
  'service.tailor': AmenityType.Tailor,
  'service.funeral_directors': AmenityType.FuneralDirectors,
  'service.bookmaker': AmenityType.Bookmaker,
  'service.estate_agent': AmenityType.EstateAgent,
  'service.locksmith': AmenityType.Locksmith,
  'service.taxi': AmenityType.Taxi,
  'service.social_facility': AmenityType.SocialFacility,
  'service.social_facility.shelter': AmenityType.SocialFacilityShelter,
  'service.social_facility.food': AmenityType.SocialFacilityFood,
  'service.social_facility.clothers': AmenityType.SocialFacilityClothers,
  tourism: AmenityType.Tourism,
  'tourism.information': AmenityType.Information,
  'tourism.information.office': AmenityType.InformationOffice,
  'tourism.information.map': AmenityType.InformationMap,
  'tourism.information.ranger_station': AmenityType.RangerStation,
  'tourism.attraction': AmenityType.Attraction,
  'tourism.attraction.artwork': AmenityType.AttractionArtwork,
  'tourism.attraction.viewpoint': AmenityType.AttractionViewpoint,
  'tourism.attraction.fountain': AmenityType.AttractionFountain,
  'tourism.attraction.clock': AmenityType.AttractionClock,
  'tourism.sights': AmenityType.Sights,
  'tourism.sights.place_of_worship': AmenityType.PlaceOfWorship,
  'tourism.sights.place_of_worship.church': AmenityType.PlaceOfWorshipChurch,
  'tourism.sights.place_of_worship.chapel': AmenityType.PlaceOfWorshipChapel,
  'tourism.sights.place_of_worship.cathedral': AmenityType.PlaceOfWorshipCathedral,
  'tourism.sights.place_of_worship.mosque': AmenityType.PlaceOfWorshipMosque,
  'tourism.sights.place_of_worship.synagogue': AmenityType.PlaceOfWorshipSynagogue,
  'tourism.sights.place_of_worship.temple': AmenityType.PlaceOfWorshipTemple,
  'tourism.sights.place_of_worship.shrine': AmenityType.PlaceOfWorshipShrine,
  'tourism.sights.monastery': AmenityType.Monastery,
  'tourism.sights.city_hall': AmenityType.CityHall,
  'tourism.sights.conference_centre': AmenityType.ConferenceCenter,
  'tourism.sights.lighthouse': AmenityType.Lighthouse,
  'tourism.sights.windmill': AmenityType.Windmill,
  'tourism.sights.tower': AmenityType.Tower,
  'tourism.sights.battlefield': AmenityType.Battlefield,
  'tourism.sights.fort': AmenityType.Fort,
  'tourism.sights.castle': AmenityType.Castle,
  'tourism.sights.ruines': AmenityType.Ruins,
  'tourism.sights.archaeological_site': AmenityType.ArchaeologicalSite,
  'tourism.sights.city_gate': AmenityType.CityGate,
  'tourism.sights.bridge': AmenityType.Bridge,
  'tourism.sights.memorial': AmenityType.Memorial,
  'tourism.sights.memorial.aircraft': AmenityType.MemorialAircraft,
  'tourism.sights.memorial.locomotive': AmenityType.MemorialLocomotive,
  'tourism.sights.memorial.railway_car': AmenityType.MemorialRailwayCar,
  'tourism.sights.memorial.ship': AmenityType.MemorialShip,
  'tourism.sights.memorial.tank': AmenityType.MemorialTank,
  'tourism.sights.memorial.tomb': AmenityType.MemorialTomb,
  'tourism.sights.memorial.monument': AmenityType.MemorialMonument,
  'tourism.sights.memorial.wayside_cross': AmenityType.MemorialWaysideCross,
  'tourism.sights.memorial.boundary_stone': AmenityType.MemorialBoundaryStone,
  'tourism.sights.memorial.pillory': AmenityType.MemorialPillory,
  'tourism.sights.memorial.milestone': AmenityType.MemorialMilestone,
  religion: AmenityType.Religion,
  'religion.place_of_worship': AmenityType.PlaceOfWorship,
  'religion.place_of_worship.buddhism': AmenityType.PlaceOfWorshipBuddhism,
  'religion.place_of_worship.christianity': AmenityType.PlaceOfWorshipChristianity,
  'religion.place_of_worship.hinduism': AmenityType.PlaceOfWorshipHinduism,
  'religion.place_of_worship.islam': AmenityType.PlaceOfWorshipIslam,
  'religion.place_of_worship.judaism': AmenityType.PlaceOfWorshipJudaism,
  'religion.place_of_worship.shinto': AmenityType.PlaceOfWorshipShinto,
  'religion.place_of_worship.sikhism': AmenityType.PlaceOfWorshipSikhism,
  'religion.place_of_worship.multifaith': AmenityType.PlaceOfWorshipMultifaith,
  camping: AmenityType.Camping,
  'camping.camp_pitch': AmenityType.CampPitch,
  'camping.camp_site': AmenityType.CampSite,
  'camping.summer_camp': AmenityType.SummerCamp,
  'camping.caravan_site': AmenityType.CaravanSite,
  amenity: AmenityType.Amenity,
  'amenity.toilet': AmenityType.Toilet,
  'amenity.drinking_water': AmenityType.DrinkingWater,
  'amenity.give_box': AmenityType.GiveBox,
  'amenity.give_box.food': AmenityType.GiveBoxFood,
  'amenity.give_box.books': AmenityType.GiveBoxBooks,
  beach: AmenityType.Beach,
  'beach.beach_resort': AmenityType.BeachResort,
  adult: AmenityType.Adult,
  'adult.nightclub': AmenityType.Nightclub,
  'adult.stripclub': AmenityType.Stripclub,
  'adult.swingerclub': AmenityType.Swingerclub,
  'adult.brothel': AmenityType.Brothel,
  'adult.casino': AmenityType.Casino,
  'adult.adult_gaming_centre': AmenityType.AdultGamingCenter,
  airport: AmenityType.Airport,
  'airport.international': AmenityType.InternationalAirport,
  building: AmenityType.Building,
  'building.residential': AmenityType.ResidentialBuilding,
  'building.commercial': AmenityType.CommercialBuilding,
  'building.industrial': AmenityType.IndustrialBuilding,
  'building.office': AmenityType.OfficeBuilding,
  'building.catering': AmenityType.CateringBuilding,
  'building.healthcare': AmenityType.HealthcareBuilding,
  'building.university': AmenityType.UniversityBuilding,
  'building.college': AmenityType.CollegeBuilding,
  'building.dormitory': AmenityType.DormitoryBuilding,
  'building.school': AmenityType.SchoolBuilding,
  'building.driving_school': AmenityType.DrivingSchoolBuilding,
  'building.kindergarten': AmenityType.KindergartenBuilding,
  'building.public_and_civil': AmenityType.PublicAndCivilBuilding,
  'building.sport': AmenityType.SportBuilding,
  'building.spa': AmenityType.SpaBuilding,
  'building.place_of_worship': AmenityType.PlaceOfWorshipBuilding,
  'building.holiday_house': AmenityType.HolidayHouseBuilding,
  'building.accommodation': AmenityType.AccommodationBuilding,
  'building.tourism': AmenityType.TourismBuilding,
  'building.transportation': AmenityType.TransportationBuilding,
  'building.military': AmenityType.MilitaryBuilding,
  'building.service': AmenityType.ServiceBuilding,
  'building.facility': AmenityType.FacilityBuilding,
  'building.garage': AmenityType.GarageBuilding,
  'building.parking': AmenityType.ParkingBuilding,
  'building.toilet': AmenityType.ToiletBuilding,
  'building.prison': AmenityType.PrisonBuilding,
  'building.entertainment': AmenityType.EntertainmentBuilding,
  'building.historic': AmenityType.HistoricBuilding,
  ski: AmenityType.Ski,
  'ski.lift': AmenityType.SkiLift,
  'ski.lift.cable_car': AmenityType.CableCarLift,
  'ski.lift.gondola': AmenityType.GondolaLift,
  'ski.lift.mixed_lift': AmenityType.MixedLift,
  'ski.lift.chair_lift': AmenityType.ChairLift,
  'ski.lift.tow_line': AmenityType.TowLineLift,
  'ski.lift.magic_carpet': AmenityType.MagicCarpetLift,
  sport: AmenityType.Sport,
  'sport.stadium': AmenityType.Stadium,
  'sport.dive_centre': AmenityType.DiveCenter,
  'sport.horse_riding': AmenityType.HorseRiding,
  'sport.ice_rink': AmenityType.IceRink,
  'sport.pitch': AmenityType.Pitch,
  'sport.sports_centre': AmenityType.SportsCenter,
  'sport.swimming_pool': AmenityType.SwimmingPool,
  'sport.track': AmenityType.Track,
  'sport.fitness': AmenityType.Fitness,
  'sport.fitness.fitness_centre': AmenityType.FitnessCenter,
  'sport.fitness.fitness_station': AmenityType.FitnessStation,
  public_transport: AmenityType.PublicTransport,
  'public_transport.train': AmenityType.Train,
  'public_transport.light_rail': AmenityType.LightRail,
  'public_transport.monorail': AmenityType.Monorail,
  'public_transport.subway': AmenityType.Subway,
  'public_transport.subway.entrance': AmenityType.SubwayEntrance,
  'public_transport.bus': AmenityType.Bus,
  'public_transport.tram': AmenityType.Tram,
  'public_transport.ferry': AmenityType.Ferry,
  'public_transport.aerialway': AmenityType.Aerialway,
  administrative: AmenityType.Administrative,
  'administrative.continent_level': AmenityType.ContinentLevel,
  'administrative.country_level': AmenityType.CountryLevel,
  'administrative.country_part_level': AmenityType.CountryPartLevel,
  'administrative.state_level': AmenityType.StateLevel,
  'administrative.county_level': AmenityType.CountyLevel,
  'administrative.city_level': AmenityType.CityLevel,
  'administrative.district_level': AmenityType.DistrictLevel,
  'administrative.suburb_level': AmenityType.SuburbLevel,
  'administrative.neighbourhood_level': AmenityType.NeighbourhoodLevel,
  postal_code: AmenityType.PostalCode,
  political: AmenityType.Political,
  low_emission_zone: AmenityType.LowEmissionZone,
  populated_place: AmenityType.PopulatedPlace,
  'populated_place.hamlet': AmenityType.Hamlet,
  'populated_place.village': AmenityType.Village,
  'populated_place.neighbourhood': AmenityType.Neighbourhood,
  'populated_place.suburb': AmenityType.Suburb,
  'populated_place.town': AmenityType.Town,
  'populated_place.city_block': AmenityType.CityBlock,
  'populated_place.quarter': AmenityType.Quarter,
  'populated_place.city': AmenityType.City,
  'populated_place.allotments': AmenityType.Allotments,
  'populated_place.county': AmenityType.County,
  'populated_place.municipality': AmenityType.Municipality,
  'populated_place.district': AmenityType.District,
  'populated_place.region': AmenityType.Region,
  'populated_place.state': AmenityType.State,
  'populated_place.borough': AmenityType.Borough,
  'populated_place.subdistrict': AmenityType.Subdistrict,
  'populated_place.province': AmenityType.Province,
  'populated_place.township': AmenityType.Township,
  production: AmenityType.Production,
  'production.factory': AmenityType.Factory,
  'production.winery': AmenityType.Winery,
  'production.brewery': AmenityType.Brewery,
  'production.cheese': AmenityType.CheeseFactory,
  'production.pottery': AmenityType.PotteryFactory,
};
