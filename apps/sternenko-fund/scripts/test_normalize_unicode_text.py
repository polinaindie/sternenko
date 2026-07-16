import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from import_report_data import normalize_unicode_text


class NormalizeUnicodeTextTests(unittest.TestCase):
    def test_strips_word_joiner_from_unit_names(self) -> None:
        self.assertEqual(
            normalize_unicode_text("\u20604 впс РУБпАК приккшр РУБпАК 5 ПРИКЗ"),
            "4 впс РУБпАК приккшр РУБпАК 5 ПРИКЗ",
        )

    def test_leaves_regular_text_unchanged(self) -> None:
        self.assertEqual(normalize_unicode_text("13 ГУ ДВКР СБУ"), "13 ГУ ДВКР СБУ")


if __name__ == "__main__":
    unittest.main()
