package com.calcom.utils;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Array utility functions for Cal.com application.
 * Java equivalent of packages/lib/array.ts
 */
public class ArrayUtils {

    /**
     * Filters out null and undefined (null in Java) values from a list.
     * Equivalent to TypeScript's notUndefined function.
     *
     * @param <T>  the type of elements in the list
     * @param list the input list that may contain null values
     * @return a new list with all null values removed
     */
    public static <T> List<T> notNull(List<T> list) {
        if (list == null) {
            return new ArrayList<>();
        }
        return list.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Removes duplicate elements from a list based on specified keys.
     * Equivalent to TypeScript's uniqueBy function.
     *
     * @param <T>           the type of elements in the list
     * @param list          the input list
     * @param keyExtractors functions to extract key values from each element
     * @return a new list with duplicates removed based on the specified keys
     */
    @SafeVarargs
    public static <T> List<T> uniqueBy(List<T> list, Function<T, Object>... keyExtractors) {
        if (list == null || list.isEmpty()) {
            return new ArrayList<>();
        }

        Set<String> seen = new LinkedHashSet<>();
        List<T> result = new ArrayList<>();

        for (T item : list) {
            String compositeKey = generateCompositeKey(item, keyExtractors);
            if (!seen.contains(compositeKey)) {
                seen.add(compositeKey);
                result.add(item);
            }
        }

        return result;
    }

    /**
     * Removes duplicate elements from a list of maps based on specified keys.
     * This is a more direct equivalent to the TypeScript uniqueBy function
     * that works with object literals.
     *
     * @param list the input list of maps
     * @param keys the keys to use for determining uniqueness
     * @return a new list with duplicates removed based on the specified keys
     */
    public static List<Map<String, Object>> uniqueByKeys(List<Map<String, Object>> list, String... keys) {
        if (list == null || list.isEmpty()) {
            return new ArrayList<>();
        }

        Set<String> seen = new LinkedHashSet<>();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Map<String, Object> item : list) {
            String compositeKey = generateCompositeKeyFromMap(item, keys);
            if (!seen.contains(compositeKey)) {
                seen.add(compositeKey);
                result.add(item);
            }
        }

        return result;
    }

    /**
     * Generates a composite key string from an item using multiple key extractors.
     */
    @SafeVarargs
    private static <T> String generateCompositeKey(T item, Function<T, Object>... keyExtractors) {
        StringBuilder keyBuilder = new StringBuilder();
        for (Function<T, Object> extractor : keyExtractors) {
            Object value = extractor.apply(item);
            keyBuilder.append(value != null ? value.toString() : "null").append("|");
        }
        return keyBuilder.toString();
    }

    /**
     * Generates a composite key string from a map using specified keys.
     */
    private static String generateCompositeKeyFromMap(Map<String, Object> item, String... keys) {
        StringBuilder keyBuilder = new StringBuilder();
        for (String key : keys) {
            Object value = item.get(key);
            keyBuilder.append(value != null ? value.toString() : "null").append("|");
        }
        return keyBuilder.toString();
    }

    /**
     * Checks if a value is not null (equivalent to TypeScript's notUndefined type guard).
     *
     * @param <T>   the type of the value
     * @param value the value to check
     * @return true if the value is not null, false otherwise
     */
    public static <T> boolean isNotNull(T value) {
        return value != null;
    }

    /**
     * Filters a list using a predicate and returns only non-null results.
     *
     * @param <T>  the type of elements in the list
     * @param list the input list
     * @return a new list with null values filtered out
     */
    public static <T> List<T> filterNotNull(List<T> list) {
        return notNull(list);
    }
}
