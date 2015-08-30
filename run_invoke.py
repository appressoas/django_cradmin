"""
Very thin wrapper around Invoke. We basically re-implement
the inv/invoke executable.

We use this when we need to create PyCharm run configurations that run Invoke tasks.
"""

if __name__ == '__main__':
    from invoke import cli
    cli.main()
