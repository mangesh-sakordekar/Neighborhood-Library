import logging
import sys

def configure_logging(level: int = logging.INFO):
    """Configure a simple structured logger for the app."""
    logger = logging.getLogger('library')
    if logger.handlers:
        return logger
    logger.setLevel(level)
    handler = logging.StreamHandler(stream=sys.stdout)
    fmt = '%(asctime)s %(levelname)s %(name)s %(module)s:%(lineno)d - %(message)s'
    formatter = logging.Formatter(fmt)
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger

# module-level logger
logger = configure_logging()
