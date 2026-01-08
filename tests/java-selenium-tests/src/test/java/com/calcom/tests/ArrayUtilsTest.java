package com.calcom.tests;

import com.calcom.tests.base.BaseTest;
import com.calcom.utils.ArrayUtils;
import org.testng.annotations.Test;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.AfterMethod;

import java.util.*;

import static org.assertj.core.api.Assertions.*;

/**
 * Java Selenium-based test scripts for Array Utilities.
 * Converted from: packages/lib/array.test.ts
 * 
 * This test class demonstrates the conversion of TypeScript Vitest tests
 * to Java TestNG tests with Selenium WebDriver support.
 * 
 * Original TypeScript tests:
 * - uniqueBy: removes duplicates based on single/multiple keys
 * - notUndefined: filters out undefined values
 */
public class ArrayUtilsTest extends BaseTest {

    /**
     * Test: should remove duplicates based on single key
     * 
     * Original TypeScript:
     * it("should remove duplicates based on single key", () => {
     *   const input = [
     *     { id: 1, name: "John" },
     *     { id: 1, name: "Jane" },
     *     { id: 2, name: "Doe" },
     *   ];
     *   const result = uniqueBy(input, ["id"]);
     *   expect(result).toHaveLength(2);
     *   expect(result).toEqual([
     *     { id: 1, name: "John" },
     *     { id: 2, name: "Doe" },
     *   ]);
     * });
     */
    @Test(description = "Should remove duplicates based on single key")
    public void testUniqueBy_SingleKey_RemovesDuplicates() {
        // Arrange - Create input list with duplicate IDs
        List<Map<String, Object>> input = new ArrayList<>();
        input.add(createMap("id", 1, "name", "John"));
        input.add(createMap("id", 1, "name", "Jane"));
        input.add(createMap("id", 2, "name", "Doe"));

        // Act - Apply uniqueBy with single key "id"
        List<Map<String, Object>> result = ArrayUtils.uniqueByKeys(input, "id");

        // Assert - Verify duplicates are removed
        assertThat(result).hasSize(2);
        assertThat(result.get(0).get("id")).isEqualTo(1);
        assertThat(result.get(0).get("name")).isEqualTo("John");
        assertThat(result.get(1).get("id")).isEqualTo(2);
        assertThat(result.get(1).get("name")).isEqualTo("Doe");
    }

    /**
     * Test: should remove duplicates based on multiple keys
     * 
     * Original TypeScript:
     * it("should remove duplicates based on multiple keys", () => {
     *   const input = [
     *     { id: 1, type: "A", value: "first" },
     *     { id: 1, type: "A", value: "second" },
     *     { id: 1, type: "B", value: "third" },
     *     { id: 2, type: "A", value: "fourth" },
     *   ];
     *   const result = uniqueBy(input, ["id", "type"]);
     *   expect(result).toHaveLength(3);
     *   expect(result).toEqual([
     *     { id: 1, type: "A", value: "first" },
     *     { id: 1, type: "B", value: "third" },
     *     { id: 2, type: "A", value: "fourth" },
     *   ]);
     * });
     */
    @Test(description = "Should remove duplicates based on multiple keys")
    public void testUniqueBy_MultipleKeys_RemovesDuplicates() {
        // Arrange - Create input list with duplicates based on id+type combination
        List<Map<String, Object>> input = new ArrayList<>();
        input.add(createMap("id", 1, "type", "A", "value", "first"));
        input.add(createMap("id", 1, "type", "A", "value", "second"));
        input.add(createMap("id", 1, "type", "B", "value", "third"));
        input.add(createMap("id", 2, "type", "A", "value", "fourth"));

        // Act - Apply uniqueBy with multiple keys "id" and "type"
        List<Map<String, Object>> result = ArrayUtils.uniqueByKeys(input, "id", "type");

        // Assert - Verify duplicates are removed based on composite key
        assertThat(result).hasSize(3);
        
        // First item: id=1, type=A, value=first
        assertThat(result.get(0).get("id")).isEqualTo(1);
        assertThat(result.get(0).get("type")).isEqualTo("A");
        assertThat(result.get(0).get("value")).isEqualTo("first");
        
        // Second item: id=1, type=B, value=third
        assertThat(result.get(1).get("id")).isEqualTo(1);
        assertThat(result.get(1).get("type")).isEqualTo("B");
        assertThat(result.get(1).get("value")).isEqualTo("third");
        
        // Third item: id=2, type=A, value=fourth
        assertThat(result.get(2).get("id")).isEqualTo(2);
        assertThat(result.get(2).get("type")).isEqualTo("A");
        assertThat(result.get(2).get("value")).isEqualTo("fourth");
    }

    /**
     * Test: should handle empty array
     * 
     * Original TypeScript:
     * it("should handle empty array", () => {
     *   const input: Array<{ id: number }> = [];
     *   const result = uniqueBy(input, ["id"]);
     *   expect(result).toEqual([]);
     * });
     */
    @Test(description = "Should handle empty array")
    public void testUniqueBy_EmptyArray_ReturnsEmptyList() {
        // Arrange - Create empty input list
        List<Map<String, Object>> input = new ArrayList<>();

        // Act - Apply uniqueBy to empty list
        List<Map<String, Object>> result = ArrayUtils.uniqueByKeys(input, "id");

        // Assert - Verify empty list is returned
        assertThat(result).isEmpty();
    }

    /**
     * Test: should handle array with single item
     * 
     * Original TypeScript:
     * it("should handle array with single item", () => {
     *   const input = [{ id: 1, name: "John" }];
     *   const result = uniqueBy(input, ["id"]);
     *   expect(result).toEqual(input);
     * });
     */
    @Test(description = "Should handle array with single item")
    public void testUniqueBy_SingleItem_ReturnsSameItem() {
        // Arrange - Create input list with single item
        List<Map<String, Object>> input = new ArrayList<>();
        input.add(createMap("id", 1, "name", "John"));

        // Act - Apply uniqueBy to single item list
        List<Map<String, Object>> result = ArrayUtils.uniqueByKeys(input, "id");

        // Assert - Verify single item is returned unchanged
        assertThat(result).hasSize(1);
        assertThat(result.get(0).get("id")).isEqualTo(1);
        assertThat(result.get(0).get("name")).isEqualTo("John");
    }

    /**
     * Test: should handle null input
     * Additional test case for Java implementation
     */
    @Test(description = "Should handle null input gracefully")
    public void testUniqueBy_NullInput_ReturnsEmptyList() {
        // Act - Apply uniqueBy to null input
        List<Map<String, Object>> result = ArrayUtils.uniqueByKeys(null, "id");

        // Assert - Verify empty list is returned
        assertThat(result).isEmpty();
    }

    /**
     * Test: notNull should filter out null values
     * Equivalent to TypeScript's notUndefined function
     */
    @Test(description = "Should filter out null values from list")
    public void testNotNull_ListWithNulls_FiltersNulls() {
        // Arrange - Create list with null values
        List<String> input = new ArrayList<>();
        input.add("a");
        input.add(null);
        input.add("b");
        input.add(null);
        input.add("c");

        // Act - Apply notNull filter
        List<String> result = ArrayUtils.notNull(input);

        // Assert - Verify nulls are filtered out
        assertThat(result).hasSize(3);
        assertThat(result).containsExactly("a", "b", "c");
    }

    /**
     * Test: notNull should handle empty list
     */
    @Test(description = "Should handle empty list for notNull")
    public void testNotNull_EmptyList_ReturnsEmptyList() {
        // Arrange - Create empty list
        List<String> input = new ArrayList<>();

        // Act - Apply notNull filter
        List<String> result = ArrayUtils.notNull(input);

        // Assert - Verify empty list is returned
        assertThat(result).isEmpty();
    }

    /**
     * Test: notNull should handle null input
     */
    @Test(description = "Should handle null input for notNull")
    public void testNotNull_NullInput_ReturnsEmptyList() {
        // Act - Apply notNull filter to null
        List<String> result = ArrayUtils.notNull(null);

        // Assert - Verify empty list is returned
        assertThat(result).isEmpty();
    }

    /**
     * Test: notNull should preserve order
     */
    @Test(description = "Should preserve order when filtering nulls")
    public void testNotNull_PreservesOrder() {
        // Arrange - Create list with specific order
        List<Integer> input = Arrays.asList(3, null, 1, null, 4, 1, 5);

        // Act - Apply notNull filter
        List<Integer> result = ArrayUtils.notNull(input);

        // Assert - Verify order is preserved
        assertThat(result).containsExactly(3, 1, 4, 1, 5);
    }

    /**
     * Test: isNotNull should return true for non-null values
     */
    @Test(description = "Should return true for non-null values")
    public void testIsNotNull_NonNullValue_ReturnsTrue() {
        assertThat(ArrayUtils.isNotNull("hello")).isTrue();
        assertThat(ArrayUtils.isNotNull(0)).isTrue();
        assertThat(ArrayUtils.isNotNull(false)).isTrue();
        assertThat(ArrayUtils.isNotNull("")).isTrue();
        assertThat(ArrayUtils.isNotNull(new ArrayList<>())).isTrue();
    }

    /**
     * Test: isNotNull should return false for null values
     */
    @Test(description = "Should return false for null values")
    public void testIsNotNull_NullValue_ReturnsFalse() {
        assertThat(ArrayUtils.isNotNull(null)).isFalse();
    }

    /**
     * Test: uniqueBy should preserve order of first occurrence
     * Additional test case for comprehensive coverage
     */
    @Test(description = "Should preserve order of first occurrence")
    public void testUniqueBy_PreservesFirstOccurrenceOrder() {
        // Arrange - Create input with specific order
        List<Map<String, Object>> input = new ArrayList<>();
        input.add(createMap("id", 3, "name", "Third"));
        input.add(createMap("id", 1, "name", "First"));
        input.add(createMap("id", 2, "name", "Second"));
        input.add(createMap("id", 1, "name", "Duplicate First"));

        // Act - Apply uniqueBy
        List<Map<String, Object>> result = ArrayUtils.uniqueByKeys(input, "id");

        // Assert - Verify order is preserved
        assertThat(result).hasSize(3);
        assertThat(result.get(0).get("id")).isEqualTo(3);
        assertThat(result.get(0).get("name")).isEqualTo("Third");
        assertThat(result.get(1).get("id")).isEqualTo(1);
        assertThat(result.get(1).get("name")).isEqualTo("First");
        assertThat(result.get(2).get("id")).isEqualTo(2);
        assertThat(result.get(2).get("name")).isEqualTo("Second");
    }

    /**
     * Test: uniqueBy should handle null values in keys
     */
    @Test(description = "Should handle null values in keys")
    public void testUniqueBy_NullValuesInKeys_HandlesCorrectly() {
        // Arrange - Create input with null key values
        List<Map<String, Object>> input = new ArrayList<>();
        input.add(createMap("id", null, "name", "Null ID 1"));
        input.add(createMap("id", null, "name", "Null ID 2"));
        input.add(createMap("id", 1, "name", "Valid ID"));

        // Act - Apply uniqueBy
        List<Map<String, Object>> result = ArrayUtils.uniqueByKeys(input, "id");

        // Assert - Verify null keys are treated as equal
        assertThat(result).hasSize(2);
    }

    /**
     * Test: uniqueBy should handle string keys
     */
    @Test(description = "Should handle string keys correctly")
    public void testUniqueBy_StringKeys_RemovesDuplicates() {
        // Arrange - Create input with string keys
        List<Map<String, Object>> input = new ArrayList<>();
        input.add(createMap("email", "test@example.com", "name", "Test 1"));
        input.add(createMap("email", "test@example.com", "name", "Test 2"));
        input.add(createMap("email", "other@example.com", "name", "Other"));

        // Act - Apply uniqueBy with string key
        List<Map<String, Object>> result = ArrayUtils.uniqueByKeys(input, "email");

        // Assert - Verify duplicates are removed
        assertThat(result).hasSize(2);
        assertThat(result.get(0).get("name")).isEqualTo("Test 1");
    }

    /**
     * Test: uniqueBy should handle three or more keys
     */
    @Test(description = "Should handle three or more keys")
    public void testUniqueBy_ThreeKeys_RemovesDuplicates() {
        // Arrange - Create input with three key combinations
        List<Map<String, Object>> input = new ArrayList<>();
        input.add(createMap("a", 1, "b", 2, "c", 3, "value", "first"));
        input.add(createMap("a", 1, "b", 2, "c", 3, "value", "duplicate"));
        input.add(createMap("a", 1, "b", 2, "c", 4, "value", "different c"));
        input.add(createMap("a", 1, "b", 3, "c", 3, "value", "different b"));

        // Act - Apply uniqueBy with three keys
        List<Map<String, Object>> result = ArrayUtils.uniqueByKeys(input, "a", "b", "c");

        // Assert - Verify duplicates are removed based on composite key
        assertThat(result).hasSize(3);
    }

    /**
     * Test: uniqueBy should handle large arrays efficiently
     */
    @Test(description = "Should handle large arrays efficiently")
    public void testUniqueBy_LargeArray_HandlesEfficiently() {
        // Arrange - Create large input list
        List<Map<String, Object>> input = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            input.add(createMap("id", i % 100, "value", "value-" + i));
        }

        // Act - Apply uniqueBy
        long startTime = System.currentTimeMillis();
        List<Map<String, Object>> result = ArrayUtils.uniqueByKeys(input, "id");
        long endTime = System.currentTimeMillis();

        // Assert - Verify correct result and reasonable performance
        assertThat(result).hasSize(100);
        assertThat(endTime - startTime).isLessThan(1000); // Should complete in under 1 second
    }

    /**
     * Helper method to create a Map with key-value pairs.
     * Simulates JavaScript object literal syntax.
     */
    private Map<String, Object> createMap(Object... keyValues) {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int i = 0; i < keyValues.length; i += 2) {
            map.put((String) keyValues[i], keyValues[i + 1]);
        }
        return map;
    }
}
