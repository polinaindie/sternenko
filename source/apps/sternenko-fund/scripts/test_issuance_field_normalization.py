import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from import_report_data import (
    dedupe_concatenated_unit,
    infer_payment_purpose,
    normalize_issuance_field,
    normalize_unit_field,
)


class IssuanceFieldNormalizationTests(unittest.TestCase):
    def test_collapses_multiline_nomenclature(self) -> None:
        self.assertEqual(
            normalize_issuance_field(
                '"FPV дрон «Horizon\n10’’-О-20 км» (оптика)"'
            ),
            '"FPV дрон «Horizon 10’’-О-20 км» (оптика)"',
        )

    def test_dedupes_concatenated_unit(self) -> None:
        self.assertEqual(
            dedupe_concatenated_unit("147 ОАБр рУБпАК147 ОАБр рУБпАК"),
            "147 ОАБр рУБпАК",
        )

    def test_strips_trailing_comma_from_unit(self) -> None:
        self.assertEqual(normalize_unit_field("42 ОМБр Perun,"), "42 ОМБр Perun")

    def test_strips_word_joiner_from_unit(self) -> None:
        self.assertEqual(
            normalize_unit_field("\u20604 впс РУБпАК приккшр РУБпАК 5 ПРИКЗ"),
            "4 впс РУБпАК приккшр РУБпАК 5 ПРИКЗ",
        )

    def test_infers_payment_purpose(self) -> None:
        self.assertEqual(infer_payment_purpose("Гривня"), "Оплата")
        self.assertEqual(infer_payment_purpose("Доплата"), "Доплата")
        self.assertEqual(infer_payment_purpose("передоплата UAH"), "Передоплата")


if __name__ == "__main__":
    unittest.main()
