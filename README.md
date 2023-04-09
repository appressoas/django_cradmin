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
```
$ brew install pipx
$ pipx ensurepath
```

Then install hatch and commitizen:
```
$ pipx install hatch 
$ pipx install commitizen
```

See https://github.com/pypa/pipx, https://hatch.pypa.io/latest/install/
and https://commitizen-tools.github.io/commitizen/ for more install alternatives if
needed, but we really recommend using pipx since that is isolated.


### Install development dependencies

Install a local python version with pyenv:
```
$ pyenv install 3.10
$ pyenv local 3.10
```

#### Create virtualenv
```
$ ./recreate-virtualenv.sh
```

Alternatively, create virtualenv manually (this does the same as recreate-virtualenv.sh):
```
$ python -m venv .venv
```
the ./recreate-virtualenv.sh script is just here to make creating virtualenvs more uniform
across different repos because some repos will require extra setup in the virtualenv
for package authentication etc.

#### Install dependencies
```
$ python -m venv .venv
$ source .venv/bin/activate
$ pip install -e ".[dev, test]"
```

### Run dev server
```
$ source .venv/bin/activate   # enable virtualenv
$ ievv devrun
```

### Run tests
```
$ source .venv/bin/activate   # enable virtualenv
$ pytest django_cradmin
```


## Docs
http://django-cradmin.readthedocs.org


## License
3-clause BSD license. See the LICENSE file in the same directory as this readme file.


## How to release django_cradmin
First make sure you have NO UNCOMITTED CHANGES!

### Buildstatic
Remove the previous built static files:
```
   $ git rm -r django_cradmin/apps/django_cradmin_js/static/django_cradmin_js/ django_cradmin/apps/django_cradmin_styles/static/django_cradmin_styles/
```

#### Temporary bump version
```
$ cz bump --dry-run
```
In the first line, starting with "bump", you'll see the new version.
Manually go to `django_cradmin/__ini__.py` and set the new version. This must be the same as the one found in the first line after running `cz bump --dry-run`

Create new production static files
```
$ ievv buildstatic --production
```
#### Undo temporary version
Undo the version change sat in `django_cradmin/__ini__.py` before committing production static files

Commit static files
  ```
  $ git add django_cradmin/apps/django_cradmin_js/static/django_cradmin_js/ django_cradmin/apps/django_cradmin_styles/static/django_cradmin_styles/
  ```

Use ```cz commit``` to get a good conventional commit.

### Release (create changelog, increment version, commit and tag the change) with:
```
$ cz bump
$ git push && git push --tags
```

### NOTE (release):
- `cz bump` automatically updates CHANGELOG.md, updates version file(s), commits the change and tags the release commit.
- If you are unsure about what `cz bump` will do, run it with `--dry-run`. You can use
  options to force a specific version instead of the one it automatically selects
  from the git log if needed, BUT if this is needed, it is a sign that someone has messed
  up with their conventional commits.
- When you push, the Azure devops pipeline will take care of the rest. It will see the
  ``bump: version ...`` commit, and release the python package to the artifact registry.
- ``cz bump`` only works if conventional commits (see section about that above) is used.
- ``cz bump`` can take a specific version etc, but it automatically select the correct version
  if conventional commits has been used correctly. See https://commitizen-tools.github.io/commitizen/.
- If you need to add more to CHANGELOG.md (migration guide, etc), you can just edit
  CHANGELOG.md after the release, and commit the change with a `docs: some useful message`
  commit.
- The ``cz`` command comes from ``commitizen`` (install documented above).

### What if the release fails?
See _How to revert a bump_ in the [commitizen FAQ](https://commitizen-tools.github.io/commitizen/faq/#how-to-revert-a-bump).

## Release to pypi:
```
$ hatch build -t sdist
$ hatch publish
$ rm dist/*              # optional cleanup
```