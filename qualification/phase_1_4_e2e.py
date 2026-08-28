"""Phase 1.4 entry point for the synthetic-only sender/receiver requalification."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from phase_1_3_e2e import main


if __name__ == "__main__":
    main()
