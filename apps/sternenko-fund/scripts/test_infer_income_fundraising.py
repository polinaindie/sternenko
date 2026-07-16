import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from import_report_data import DEFAULT_INCOME_FUNDRAISING, infer_income_fundraising


class InferIncomeFundraisingTests(unittest.TestCase):
    def test_defaults_to_current_fundraising(self) -> None:
        self.assertEqual(infer_income_fundraising(""), DEFAULT_INCOME_FUNDRAISING)
        self.assertEqual(
            infer_income_fundraising("Переказ у фонд Спільнота Стерненка від Іванов"),
            DEFAULT_INCOME_FUNDRAISING,
        )

    def test_reads_explicit_fundraisings(self) -> None:
        self.assertEqual(infer_income_fundraising("На русоріз"), "Русоріз")
        self.assertEqual(
            infer_income_fundraising("Благодійний внесок на конверт"),
            "Конверт на перехоплення",
        )
        self.assertEqual(
            infer_income_fundraising(
                "На Поточний Русоріз від Баранова Наталія Володимирівна 20260706"
            ),
            DEFAULT_INCOME_FUNDRAISING,
        )
        self.assertEqual(
            infer_income_fundraising(
                "Благодійний платіж на Небесний RUSORIZ за 2026-07-05 згiдно реєстру"
            ),
            "Небесний Русоріз",
        )


if __name__ == "__main__":
    unittest.main()
