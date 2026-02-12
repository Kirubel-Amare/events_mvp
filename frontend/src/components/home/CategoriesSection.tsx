import { SafeImage } from "@/components/shared/safe-image"

interface CategoriesSectionProps {
  categories: any[]
  activeCategory: string
  setActiveCategory: (category: string) => void
}

export function CategoriesSection({ 
  categories, 
  activeCategory, 
  setActiveCategory 
}: CategoriesSectionProps) {
  return (
    <section className="container py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-3 text-gray-900">Browse by Category</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Find events that match your interests from our diverse collection
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => category?.name && setActiveCategory(category.name.toLowerCase())}
            className={`group relative overflow-hidden rounded-xl transition-all ${
              activeCategory === category?.name?.toLowerCase()
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : 'hover:shadow-md'
            }`}
          >
            <div className="relative h-32">
              <SafeImage
                src={`https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&category=${category.name}`}
                alt={category.name}
                fill
                className="object-cover opacity-30"
              />
              <div className={`absolute inset-0 bg-blue-100 opacity-80`} />
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                <span className="text-2xl mb-2">{category.icon || "✨"}</span>
                <div className="font-semibold text-sm text-center mb-1">{category.name}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}