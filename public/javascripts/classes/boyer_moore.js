var Boyer_Moore = {
  find_pattern: function(pattern, string) {
    function make_bad_match_table(pattern) {
      var patterns = {};
      for (var p = 0; p < pattern.length; p++) {
        if (p != pattern.length - 1) {
          patterns[pattern.charAt(p)] = pattern.length - p - 1;
        }
        else {
          if (!patterns[pattern.charAt(p)]) {
          patterns[pattern.charAt(p)] = pattern.length;
          }
        }
      }
      return patterns;
    }
    var bad_match_table = make_bad_match_table(pattern);
    var matches = []
    var index = pattern.length - 1
    while(index < string.length) {
      var p = pattern.length - 1;
      while (p >= 0) {
        var string_char = string.charAt(index - pattern.length + 1 + p);
        if (pattern.charAt(p) != string_char) {
          if (bad_match_table[string.charAt(index)] !== undefined) {
            index += Number(bad_match_table[string.charAt(index)]);
          }
          else {
            index += pattern.length;
          }
          break;
        }
        p--;
      }
      if (p < 0) {
        matches.push(index - pattern.length + 1);
        index += Number(bad_match_table[string.charAt(index)]);
      }
    }
    return matches;
  }
}
