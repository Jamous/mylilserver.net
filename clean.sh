# Clean out cached build files
rm -rf build/_build/html/*
rm -rf docs/*

# Rebuild site
make -C build/ html
