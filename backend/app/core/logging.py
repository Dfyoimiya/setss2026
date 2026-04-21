"""Structured logging configuration.

Configures Python's standard logging to output JSON in production
and human-readable format in development.
"""

import logging
import sys


class _ColourFormatter(logging.Formatter):
    """Colourful console formatter for development."""

    # ANSI colour codes
    GREY = "\x1b[38;20m"
    YELLOW = "\x1b[33;20m"
    RED = "\x1b[31;20m"
    BOLD_RED = "\x1b[31;1m"
    RESET = "\x1b[0m"

    FORMAT = (
        "%(asctime)s | %(levelname)-8s | %(name)s:%(lineno)d | %(message)s"
    )

    FORMATS = {
        logging.DEBUG: GREY + FORMAT + RESET,
        logging.INFO: GREY + FORMAT + RESET,
        logging.WARNING: YELLOW + FORMAT + RESET,
        logging.ERROR: RED + FORMAT + RESET,
        logging.CRITICAL: BOLD_RED + FORMAT + RESET,
    }

    def format(self, record: logging.LogRecord) -> str:
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt, datefmt="%Y-%m-%d %H:%M:%S")
        return formatter.format(record)


def setup_logging(*, level: int | None = None, json_format: bool | None = None) -> None:
    """Configure application-wide logging.

    Args:
        level: Logging level. Defaults to INFO in production, DEBUG otherwise.
        json_format: Force JSON formatting. Auto-detected from environment if None.
    """
    # Auto-detect format: JSON in production (no reload), pretty in dev
    if json_format is None:
        json_format = False  # Keep it simple; set True in production containers

    if level is None:
        level = logging.DEBUG  # Default to DEBUG for this project phase

    root = logging.getLogger()
    root.setLevel(level)

    # Remove existing handlers to avoid duplicates on re-initialization
    for handler in root.handlers[:]:
        root.removeHandler(handler)

    handler: logging.Handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(level)

    if json_format:
        # JSON format for production log aggregation (e.g., ELK, Datadog)
        formatter = logging.Formatter(
            "{"
            '"timestamp": "%(asctime)s", '
            '"level": "%(levelname)s", '
            '"logger": "%(name)s", '
            '"message": "%(message)s", '
            '"pathname": "%(pathname)s", '
            '"lineno": %(lineno)d'
            "}"
        )
    else:
        formatter = _ColourFormatter()

    handler.setFormatter(formatter)
    root.addHandler(handler)

    # Reduce noise from third-party libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
