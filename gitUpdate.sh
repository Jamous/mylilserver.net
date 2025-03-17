# Clean out cached build files
rm -rf build/_build/html/*
rm -rf docs/*

# Rebuild site
make -C build/ html

#Copy over .nojekyll and docs
cp .nojekyll  docs/
cp CNAME docs/

#Push updates
git add .
git commit -m "Website update"
git push
