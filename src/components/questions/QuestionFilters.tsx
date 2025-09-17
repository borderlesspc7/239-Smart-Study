import React, { useState } from "react";
import { QuestionFilter } from "../../models/question/question";

interface QuestionFiltersProps {
  filters: QuestionFilter;
  onFilterChange: (filters: QuestionFilter) => void;
  categories: any[];
  tags: string[];
}

export const QuestionFilters: React.FC<QuestionFiltersProps> = ({
  filters,
  onFilterChange,
  categories,
  tags,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof QuestionFilter, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    handleFilterChange("tags", newTags);
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).some((key) => {
    const value = filters[key as keyof QuestionFilter];
    return value !== undefined && value !== null && value !== "";
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Limpar filtros
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            {isExpanded ? "Ocultar" : "Mostrar"} filtros
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Filtro por categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matéria
            </label>
            <select
              value={filters.categoryId || ""}
              onChange={(e) =>
                handleFilterChange("categoryId", e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as matérias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por dificuldade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dificuldade
            </label>
            <div className="flex space-x-4">
              {["Fácil", "Médio", "Difícil"].map((difficulty) => (
                <label key={difficulty} className="flex items-center">
                  <input
                    type="radio"
                    name="difficulty"
                    value={difficulty}
                    checked={filters.difficulty === difficulty}
                    onChange={(e) =>
                      handleFilterChange("difficulty", e.target.value as any)
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{difficulty}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filtro por tipo de exame */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Exame
            </label>
            <select
              value={filters.examType || ""}
              onChange={(e) =>
                handleFilterChange("examType", e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os tipos</option>
              <option value="ENEM">ENEM</option>
              <option value="VESTIBULAR">Vestibular</option>
              <option value="CONCURSO">Concurso</option>
              <option value="GENERAL">Geral</option>
            </select>
          </div>

          {/* Filtro por tipo de questão */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Questão
            </label>
            <select
              value={filters.type || ""}
              onChange={(e) =>
                handleFilterChange("type", e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os tipos</option>
              <option value="Múltipla Escolha">Múltipla Escolha</option>
              <option value="Verdadeiro/Falso">Verdadeiro/Falso</option>
              <option value="Dissertativa">Dissertativa</option>
              <option value="Completar">Completar</option>
            </select>
          </div>

          {/* Filtro por favoritos */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.isFavorite || false}
                onChange={(e) =>
                  handleFilterChange(
                    "isFavorite",
                    e.target.checked || undefined
                  )
                }
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Apenas favoritos</span>
            </label>
          </div>

          {/* Filtro por tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.tags?.includes(tag)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filtros ativos */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.categoryId && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                {categories.find((c) => c.id === filters.categoryId)?.name}
                <button
                  onClick={() => handleFilterChange("categoryId", undefined)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}

            {filters.difficulty && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                {filters.difficulty}
                <button
                  onClick={() => handleFilterChange("difficulty", undefined)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}

            {filters.examType && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                {filters.examType}
                <button
                  onClick={() => handleFilterChange("examType", undefined)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}

            {filters.tags && filters.tags.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                {filters.tags.length} tag(s)
                <button
                  onClick={() => handleFilterChange("tags", undefined)}
                  className="ml-1 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            )}

            {filters.isFavorite && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                Favoritos
                <button
                  onClick={() => handleFilterChange("isFavorite", undefined)}
                  className="ml-1 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
