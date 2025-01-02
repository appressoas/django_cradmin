# Django cradmin

Django custom role based admin UI.

Django cradmin is in BETA. The system is fairly stable, but:

- We do not have getting started guides.
- We should have better tests before release. Some parts have been prototyped
  a lot while we tested out different concepts, and they need a complexity
  review and better tests.
- Works with Django 4 and python >=3.8,<3.11

## Develop
Requires:
- https://github.com/pyenv/pyenv


### Use conventional commits for GIT commit messages
See https://www.conventionalcommits.org/en/v1.0.0/.
You can use this git commit message format in many different ways, but the easiest is:

- Use commitizen: https://commitizen-tools.github.io/commitizen/commit/
- Use an editor extension, like https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits for VScode.
- Just learn to write the format by hand (can be error prone to begin with, but it is fairly easy to learn).


### Install hatch and commitizen
NOTE: You only need hatch if you need to build releases, and you
only need commitizen for releases OR to make it easy to follow
conventional commits for your commit messages
(see _Use conventional commits for GIT commit messages_ above).

First install pipx with:
```bash
brew install pipx
pipx ensurepath
```

Then install hatch and commitizen:
```bash
pipx install hatch
pipx install commitizen
```

See https://github.com/pypa/pipx, https://hatch.pypa.io/latest/install/
and https://commitizen-tools.github.io/commitizen/ for more install alternatives if
needed, but we really recommend using pipx since that is isolated.


### Install development dependencies

Install a local python version with pyenv:
```bash
pyenv install $(pyenv latest -k 3.12)
pyenv local 3.12
```

#### Create virtualenv
```bash
./tools/recreate-virtualenv.sh
```

> Alternatively, create virtualenv manually (this does the same as recreate-virtualenv.sh):
> ```bash
> python -m venv .venv
> ```
> the ./tools/recreate-virtualenv.sh script is just here to make creating virtualenvs more uniform
> across different repos because some repos will require extra setup in the virtualenv
> for package authentication etc.

#### Install dependencies
```bash
source .venv/bin/activate
pip install -e ".[dev, test]"
# install dependencies in virtualenv without "activate"
.venv/bin/pip install -e ".[dev,test]"
```

### Run dev server
```bash
source .venv/bin/activate   # enable virtualenv
ievv devrun
```

### Run tests
```bash
source .venv/bin/activate   # enable virtualenv
pytest django_cradmin
```

### Build css/javascript:
```bash
source .venv/bin/activate   # enable virtualenv
nvm use 14    # May need to run "nvm install 14" first
ievv buildstatic
# ... or if you want to watch for changes ...:
ievv buildstatic --watch
```


## Docs
http://django-cradmin.readthedocs.org


## License
3-clause BSD license. See the LICENSE file in the same directory as this readme file.


## How to release django_cradmin
First make sure you have NO UNCOMITTED CHANGES!

### Buildstatic
Remove the previous built static files:
```bash
git rm -r django_cradmin/apps/django_cradmin_js/static/django_cradmin_js/ django_cradmin/apps/django_cradmin_styles/static/django_cradmin_styles/
```

#### Bump version and add changelog
```bash
cz bump --files-only --changelog
```

#### Build static files
Create new production static files
```bash
nvm use 14    # May need to run "nvm install 14" first
ievv buildstatic --production
```

Commit static files
__NB__: Make sure you also commit `pyproject.toml` and `django_cradmin/__init__.py`, as the new version is in these files now.
```bash
git add pyproject.toml django_cradmin/__init__.py django_cradmin/apps/django_cradmin_js/static/django_cradmin_js/ django_cradmin/apps/django_cradmin_styles/static/django_cradmin_styles/
git status
# ... make sure there are no more files that need to be added ...
git commit -m "bump: $(cz version --project)"
```

#### Make tag and push
Create tag with the current version
```bash
git tag $(cz version --project)
git push && git push --tags
```

### What if the release fails?
See _How to revert a bump_ in the [commitizen FAQ](https://commitizen-tools.github.io/commitizen/faq/#how-to-revert-a-bump).

## Release to pypi:
```bash
hatch build -t sdist
hatch publish
rm dist/*              # optional cleanup
```
