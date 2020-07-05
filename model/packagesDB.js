let packages = [
  {
    title: "Muscle gain",
    image: "package-muscle-gain.jpg",
    price: 159,
    category: 1,
    noOfMeals: 15,
    desc:
      "High protein and calorie portions to support muscle gain momentum",
  },
  {
    title: "Weight loss",
    image: "package-weight-loss.jpg",
    price: 145,
    category: 2,
    noOfMeals: 20,
    desc:
      "High protein and low calorie meals with a nutrient profile tuned for weight loss",
  },
  {
    title: "Keto",
    image: "package-keto.jpg",
    price: 159,
    category: 3,
    noOfMeals: 15,
    desc:
      "High fat, low carb meals with moderate protein to achieve and sustain ketosis",
  },
  {
    title: "Fat Burner",
    image: "package-fat-burner.jpg",
    price: 159,
    category: 2,
    noOfMeals: 15,
    desc:
      "Low carb, nutrient-rich meals with fat-burning profile to support fat loss",
  },
];

let getData = () => packages;

module.exports = getData;
