export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Tea Rituals' | 'Herbal Ingredients' | 'Brewing' | 'Kindleaf Story';
  readTime: string;
  date: string;
  excerpt: string;
  coverImage: string;
  content: string[];
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: "art-1",
    slug: "art-of-slow-brewing",
    title: "The Art of Slow Brewing: Why Temperature and Patience Matter",
    category: "Brewing",
    readTime: "4 min read",
    date: "August 2026",
    coverImage: "/assets/hero_tea_cup.png",
    excerpt: "Most people brew green tea with boiling water and wonder why it tastes harsh. Learn the science of gentle heat and why 85°C produces liquid gold.",
    content: [
      "When hot water meets delicate whole-leaf green tea and botanicals, extraction begins within seconds. Standard commercial habits encourage pouring rolling boiling water (100°C) straight into a mug. However, at boiling point, bitter catechins and tannins rush out before sweet, delicate amino acids like L-theanine can balance the cup.",
      "By keeping water temperature around 85°C—marked visually by small, energetic bubbles gathering at the bottom of the kettle—the green tea leaves unfurl gracefully without scorching.",
      "Equally essential is steeping time. Allowing 3 to 5 minutes covered traps the natural aroma and volatile compounds from lemongrass and holy basil that would otherwise evaporate into thin air.",
      "The result is a translucent amber-green infusion that carries bright citrus notes upfront, followed by an aromatic herbal middle and a comforting ginger warmth."
    ]
  },
  {
    id: "art-2",
    slug: "botanical-synergy-tulsi-lemongrass",
    title: "Tulsi & Lemongrass: Botanical Aromas in Ancient and Modern Tea Traditions",
    category: "Herbal Ingredients",
    readTime: "5 min read",
    date: "August 2026",
    coverImage: "/assets/product_natural.png",
    excerpt: "Exploring the centuries-old presence of Holy Basil (Tulsi) in Indian households and how crisp lemongrass elevates traditional green tea.",
    content: [
      "In traditional Indian homes, Holy Basil (Ocimum tenuiflorum, commonly known as Tulsi) has held a cherished place in courtyard gardens for centuries. Known for its distinctively aromatic, peppery scent, Tulsi was traditionally plucked fresh and steeped into warm water during quiet dawn rituals.",
      "When paired with lemongrass (Cymbopogon citratus), a fascinating sensory transition occurs. Lemongrass carries citral, which introduces a sparkling, clean citrus top note. This cuts through the astringency of traditional green tea and softens the herbal depth of Tulsi.",
      "At Kindleaf, we hand-blend whole cut leaves rather than pulverizing them into dusty tea-bag powder. Whole botanicals retain their natural cell structures and fragrant oils until the moment hot water activates them in your cup."
    ]
  },
  {
    id: "art-3",
    slug: "reclaiming-ten-quiet-minutes",
    title: "Mindful Tea Rituals: Reclaiming Ten Quiet Minutes in a Noisy Day",
    category: "Tea Rituals",
    readTime: "3 min read",
    date: "July 2026",
    coverImage: "/assets/hero_tea_cup.png",
    excerpt: "A simple cup of tea can become an anchor in your day. Here is how to turn preparation into an intentional, grounding pause.",
    content: [
      "We live in a world of constant pings, urgent notifications, and back-to-back demands. We frequently reach for caffeinated beverages while rushing between tasks, barely noticing what we are drinking.",
      "A daily tea ritual is not about elaborate ceremonies or rigid rules. It is simply an agreement with yourself to pause for ten minutes.",
      "Notice the visual unfurling of the leaves. Feel the comforting weight and warmth of the cup in both hands. Take three deliberate nasal breaths before the first sip.",
      "These brief sensory anchors remind our nervous systems that between every demand, there is space to pause and restore calm."
    ]
  },
  {
    id: "art-4",
    slug: "soldiers-home-story",
    title: "From a Soldier’s Home to Your Cup: The Kindleaf Journey",
    category: "Kindleaf Story",
    readTime: "5 min read",
    date: "July 2026",
    coverImage: "/assets/product_combo.png",
    excerpt: "How honest values, discipline, and a deep respect for natural ingredients shaped Kindleaf in Jasrana, Uttar Pradesh.",
    content: [
      "Kindleaf was founded by Gaurav Singh, raised in a proud soldier’s family in Jasrana, Firozabad, Uttar Pradesh. In a home shaped by military discipline, honesty and accountability were foundational values.",
      "When looking at the modern wellness market, it was frustrating to see shelves dominated by mass-produced teas sprayed with artificial flavoring agents and marketed with dubious miracle claims.",
      "Kindleaf was created with a clear golden rule: 'If you can’t consume your own product every single day, you have no business selling it to others.'",
      "From selecting green tea base, fragrant Holy Basil, crisp lemongrass, to real dried ginger root, every batch is prepared with pride, transparency, and care."
    ]
  }
];
