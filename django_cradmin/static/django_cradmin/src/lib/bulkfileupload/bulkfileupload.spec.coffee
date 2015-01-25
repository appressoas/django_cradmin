angular.module('djangoCradmin.detectizrMockDesktop', [])
.factory 'cradminDetectize', ->
  return {
    device: {
      type: 'desktop'
    }
  }

angular.module('djangoCradmin.detectizrMockMobile', [])
.factory 'cradminDetectize', ->
  return {
    device: {
      type: 'mobile'
    }
  }


describe 'djangoCradminBulkfileuploadAdvanced', ->
  $compile = null
  $rootScope = null
  beforeEach(module('djangoCradmin.bulkfileupload', 'djangoCradmin.detectizrMockDesktop'))

  # Store references to $rootScope and $compile
  # so they are available to all tests in this describe block
  beforeEach inject((_$compile_, _$rootScope_) ->
    # The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_
    $rootScope = _$rootScope_
  )

  it 'should hide simple widget', ->
    scope = {}
    html = """
      <form django-cradmin-bulkfileupload-form>
        <div django-cradmin-bulkfileupload="/file_upload_api_mock">
          <div django-cradmin-bulkfileupload-advanced-widget id="advanced"></div>
          <div django-cradmin-bulkfileupload-simple-widget id="simple"></div>
        </div>
      </form>
    """
    element = $compile(html)($rootScope)
    $rootScope.$digest()
    expect(element.find('#simple').css('display')).toBe('none')
    expect(element.find('#advanced').css('display')).toBe('')


describe 'djangoCradminBulkfileuploadMobile', ->
  $compile = null
  $rootScope = null
  beforeEach(module('djangoCradmin.bulkfileupload', 'djangoCradmin.detectizrMockMobile'))

  # Store references to $rootScope and $compile
  # so they are available to all tests in this describe block
  beforeEach inject((_$compile_, _$rootScope_) ->
    # The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_
    $rootScope = _$rootScope_
  )

  it 'should hide advanced widget', ->
    scope = {}
    html = """
      <form django-cradmin-bulkfileupload-form>
        <div django-cradmin-bulkfileupload="/file_upload_api_mock">
          <div django-cradmin-bulkfileupload-advanced-widget id="advanced"></div>
          <div django-cradmin-bulkfileupload-simple-widget id="simple"></div>
        </div>
      </form>
    """
    element = $compile(html)($rootScope)
    $rootScope.$digest()
    expect(element.find('#simple').css('display')).toBe('')
    expect(element.find('#advanced').css('display')).toBe('none')


describe 'djangoCradminBulkfileuploadInProgressOrFinished', ->
  $compile = null
  $rootScope = null
  formElement = null
  inProgressOrFinishedElement = null
  inProgressOrFinishedScope = null

  beforeEach(module(
    'djangoCradmin.bulkfileupload',
    'djangoCradmin.templates',
    'djangoCradmin.detectizrMockDesktop'
  ))

  beforeEach inject((_$compile_, _$rootScope_) ->
    $compile = _$compile_
    $rootScope = _$rootScope_
    html = """
      <form django-cradmin-bulkfileupload-form>
        <div django-cradmin-bulkfileupload="/file_upload_api_mock">
          <div django-cradmin-bulk-in-progress-or-finished id="in-progress-or-finished"></div>
        </div>
      </form>
    """

    formElement = $compile(html)($rootScope)
    $rootScope.$digest()
    inProgressOrFinishedElement = formElement.find('#in-progress-or-finished')
    inProgressOrFinishedScope = inProgressOrFinishedElement.isolateScope()
  )

  getProgressPercents = ->
    progressPercents = []
    elements = inProgressOrFinishedElement.find(
      '.django-cradmin-progresspercent-number')
    for domelement in elements
      percent = angular.element(domelement).text().trim()
      progressPercents.push(percent)
    return progressPercents

  it 'should re-render when adding FileInfoList', ->
    expect(inProgressOrFinishedElement.find(
      '.django-cradmin-bulkfileupload-in-progress-or-finished-item').length).toBe(0)
    inProgressOrFinishedScope.fileInfoLists.push({
      percent: 0
      files: [{name: 'test.txt'}]
    })
    inProgressOrFinishedScope.$apply()
    expect(inProgressOrFinishedElement.find(
      '.django-cradmin-bulkfileupload-in-progress-or-finished-item').length).toBe(1)

  it 'should re-render when changing percent', ->
    inProgressOrFinishedScope.fileInfoLists = [{
      percent: 0
      files: [{name: 'test.txt'}]
    }]
    inProgressOrFinishedScope.$apply()
    expect(getProgressPercents()[0]).toBe('0')

    inProgressOrFinishedScope.fileInfoLists[0].percent = '20'
    inProgressOrFinishedScope.$apply()
    expect(getProgressPercents()[0]).toBe('20')
