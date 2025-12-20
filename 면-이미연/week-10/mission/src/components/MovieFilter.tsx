import { memo, useState, type FormEvent } from "react";
import type { MovieFilters, MovieLanguage } from "../types/movie";
import { Input } from "./Input";
import { SelectBox } from "./SelectBox";
import LanguageSelector from "./LanguageSelector";
import { LANGUAGE_OPTIONS } from "../constants/movie";

interface MovieFilterProps {
    onChange: (filter: MovieFilters) => void;
}

const MovieFilter = ({ onChange }: MovieFilterProps) => {
    const [query, setQuery] = useState("");
    const [includeAdult, setIncludeAdult] = useState(false);
    const [language, setLanguage] = useState<MovieLanguage>("ko-KR");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 엔터/버튼 기본 제출 막기

        onChange({
            query,
            include_adult: includeAdult,
            language,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl bg-white p-6 shadow-xl mb-8"
        >
            <div className="flex flex-wrap gap-6">
                <div className="min-w-[450px] flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        🎬 영화 제목
                    </label>
                    <Input value={query} onChange={setQuery} />
                </div>

                <div className="min-w-[250px] flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        ⚙️ 옵션
                    </label>
                    <SelectBox
                        checked={includeAdult}
                        onChange={setIncludeAdult}
                        label="성인 콘텐츠 표시"
                        id="include_adult"
                    />
                </div>

                <div className="min-w-[250px] flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        🌏 언어
                    </label>
                    <LanguageSelector
                        value={language}
                        onChange={setLanguage}
                        options={LANGUAGE_OPTIONS}
                    />
                </div>

                <div className="w-full pt-4">
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-500 py-3 text-white font-semibold hover:bg-blue-600 transition-all"
                    >
                        🔍 검색
                    </button>
                </div>
            </div>
        </form>
    );
};

export default memo(MovieFilter);