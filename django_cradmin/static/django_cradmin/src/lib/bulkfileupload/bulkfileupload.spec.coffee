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
